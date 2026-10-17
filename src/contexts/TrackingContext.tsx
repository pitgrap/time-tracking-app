import React, { useContext, useEffect, useState } from "react";
import { Props } from "../models/App";
import { DailyTracking } from "../models/DailyTracking";
import { advanceTracking, useTrackingStorage } from "../utils/TrackingStorage";

export interface TrackingContext {
  now: Date;
  tracking: DailyTracking;
  resetToday: () => void;
  setCustomStart: (startTime: number) => void;
}

const trackingContext = React.createContext<TrackingContext | undefined>(undefined);

// custom context consumer hook
export const useTrackingContext = (): TrackingContext => {
  const context = useContext(trackingContext);
  if (!context) {
    throw new Error("useTrackingContext must be used within a TrackingContextProvider");
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

  const resetToday = () => {
    const current = new Date();
    setNow(current);
    setTracking((previous) => ({ ...previous, start: current.getTime(), end: current.getTime() }));
  };

  const setCustomStart = (startTime: number) => {
    setTracking((previous) => ({ ...previous, start: startTime }));
  };

  return (
    <trackingContext.Provider value={{ now, tracking, resetToday, setCustomStart }}>
      {children}
    </trackingContext.Provider>
  );
};
