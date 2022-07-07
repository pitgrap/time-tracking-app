import React, { useEffect, useState } from "react";
import { useSettingsContext } from "../contexts/SettingsContext";
import { DailyTracking } from "../models/DailyTracking";
import { getTodayStorageKey, useLocalStorage } from "../utils/LocalStorage";
import { msToTime, timeFrameInPercent } from "../utils/Time";

export const Tracking: React.FC = () => {
  const { settings } = useSettingsContext();
  const timer = 1000; // 1 second
  const [now, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date());
    }, timer);
  }, []);

  const initTracking: DailyTracking = {
    day: new Date(),
    start: now.getTime(),
    end: now.getTime(),
    duration: 1000,
  };

  const [tracking] = useLocalStorage(getTodayStorageKey(), initTracking);
  if (tracking.end !== now.getTime()) {
    tracking.end = now.getTime();
    tracking.duration = tracking.end - tracking.start;
  }

  return (
    <>
      <h2>
        {new Date(tracking.day).toLocaleDateString("de-DE", { weekday: "long" })},{" "}
        {new Date(tracking.day).toLocaleDateString()}
      </h2>
      <p className="app-overview">
        Beginn: <time className="app-time">{new Date(tracking.start).toLocaleTimeString()}</time>
        <br />
        Ende: <time className="app-time">{new Date(tracking.end).toLocaleTimeString()}</time>
      </p>
      <p>
        Arbeitszeit: {msToTime(tracking.duration)} ({timeFrameInPercent(tracking.duration, settings?.dailyWork || 8)})
      </p>
    </>
  );
};
