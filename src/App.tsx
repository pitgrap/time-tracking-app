import React, { useEffect, useState } from "react";
import { datetoKey, msToTime, timeFrameInPercent, useLocalStorage } from "./helpers";
import { DailyTracking } from "./DailyTracking";
import logo from "./logo.svg";
import "./App.css";

const App: React.FC = () => {
  const dailyWork = 1000 * 60 * 60 * 8; // 8 hours
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

  const [tracking] = useLocalStorage(datetoKey(initTracking.day), initTracking);
  if (tracking.end !== now.getTime()) {
    tracking.end = now.getTime();
    tracking.duration = tracking.end - tracking.start;
  }

  // ideas:
  // - settings page for "dailyWork", etc.
  // - pause button
  // - stop button

  return (
    <div className="app">
      <main className="app-main">
        <h1>Automatische Zeiterfassung</h1>
        <img src={logo} className="app-logo" alt="logo" />
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
          Arbeitszeit: {msToTime(tracking.duration)} ({timeFrameInPercent(tracking.duration, dailyWork)})
        </p>
      </main>
    </div>
  );
};

export default App;
