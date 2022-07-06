import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { msToTime, timeFrameInPercent, useLocalStorage } from "./helpers";

const App: React.FC = () => {
  const today = new Date().toLocaleDateString();
  const weekDay = new Date().toLocaleDateString("de-DE", { weekday: "long" });
  const dailyWork = 1000 * 60 * 60 * 8;

  const [now, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date());
    }, 1000);
  }, []);

  const [start] = useLocalStorage("start_" + today, now.getTime());
  const [end, setEnd] = useLocalStorage("end_" + today, now.getTime());

  if (end !== now.getTime()) {
    setEnd(now.getTime());
  }

  // ideas:
  // - settings page for "dailyWork",
  // - stop button
  // - github repo
  // - publish github pages

  return (
    <div className="app">
      <main className="app-main">
        <h1>Automatische Zeiterfassung</h1>
        <img src={logo} className="app-logo" alt="logo" />
        <h2>
          {weekDay}, {today}
        </h2>
        <p className="app-overview">
          Beginn: <time className="app-time">{new Date(start).toLocaleTimeString()}</time>
          <br />
          Ende: <time className="app-time">{new Date(end).toLocaleTimeString()}</time>
        </p>
        <p>
          Arbeitszeit: {msToTime(end - start)} ({timeFrameInPercent(end - start, dailyWork)})
        </p>
      </main>
    </div>
  );
};

export default App;
