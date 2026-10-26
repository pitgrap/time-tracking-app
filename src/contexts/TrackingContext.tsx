import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Props } from "../models/App";
import { DailyTracking } from "../models/DailyTracking";
import { advanceTracking, useTrackingStorage } from "../utils/TrackingStorage";

export interface TrackingContext {
  now: Date;
  tracking: DailyTracking;
}

export interface TrackingActionsContext {
  resetToday: () => void;
  setCustomStart: (startTime: number) => void;
}

// Split from TrackingContext on purpose: `now`/`tracking` change every
// second, but resetToday/setCustomStart almost never do. Bundling them in
// one context would force every consumer of the actions (e.g. SettingsDialog,
// mounted for the whole app session) to re-render every second too, purely
// because they share a Provider value object with the ticking clock.
const trackingContext = React.createContext<TrackingContext | undefined>(undefined);
const trackingActionsContext = React.createContext<TrackingActionsContext | undefined>(undefined);

// custom context consumer hook
export const useTrackingContext = (): TrackingContext => {
  const context = useContext(trackingContext);
  if (!context) {
    throw new Error("useTrackingContext must be used within a TrackingContextProvider");
  }
  return context;
};

// custom context consumer hook for the stable resetToday/setCustomStart actions
export const useTrackingActions = (): TrackingActionsContext => {
  const context = useContext(trackingActionsContext);
  if (!context) {
    throw new Error("useTrackingActions must be used within a TrackingContextProvider");
  }
  return context;
};

// custom provider - always mounted at the app level (independent of whether
// today is a working day), so resetToday()/setCustomStart() never get lost
// because the Tracking display happened not to be mounted when they're called
export const TrackingContextProvider: React.FC<Props> = ({ children }) => {
  const [now, setNow] = useState(() => new Date());

  const initTracking: DailyTracking = {
    day: now,
    start: now.getTime(),
    end: now.getTime(),
  };

  const [tracking, setTracking] = useTrackingStorage(initTracking);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const current = new Date();
      setNow(current);
      setTracking((previous) => advanceTracking(previous, current));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [setTracking]);

  const resetToday = useCallback(() => {
    const current = new Date();
    setNow(current);
    setTracking((previous) => ({ ...previous, start: current.getTime(), end: current.getTime() }));
  }, [setTracking]);

  const setCustomStart = useCallback(
    (startTime: number) => {
      setTracking((previous) => ({ ...previous, start: startTime }));
    },
    [setTracking],
  );

  const liveValue = useMemo<TrackingContext>(() => ({ now, tracking }), [now, tracking]);
  const actionsValue = useMemo<TrackingActionsContext>(
    () => ({ resetToday, setCustomStart }),
    [resetToday, setCustomStart],
  );

  return (
    <trackingContext.Provider value={liveValue}>
      <trackingActionsContext.Provider value={actionsValue}>{children}</trackingActionsContext.Provider>
    </trackingContext.Provider>
  );
};
