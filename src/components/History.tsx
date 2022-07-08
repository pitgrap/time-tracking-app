import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useCloseOnEsc } from "../utils/UI";
import { getAllTrackings } from "../utils/LocalStorage";
import { msToTime, timeFrameInPercent } from "../utils/Time";
import close from "../assets/close.svg";
import "./History.css";

export const History: React.FC = () => {
  const { showHistory, toggleHistory } = useAppContext();
  const { settings } = useSettingsContext();

  const allTrackings = getAllTrackings(true);

  // ideas:
  // - export as csv

  // close on esc
  useCloseOnEsc(showHistory, toggleHistory);

  return (
    <>
      {showHistory && (
        <>
          <div className="app__background" onClick={toggleHistory}></div>
          <dialog className="app-history">
            <span className="app__close" onClick={toggleHistory}>
              <img src={close} alt="Schliessen" />
            </span>
            <h2>Verlauf</h2>
            {allTrackings.length === 0 && <p>Kein Verlauf vorhanden.</p>}
            {allTrackings.length > 0 && (
              <>
                <p>
                  ({allTrackings.length} {allTrackings.length === 1 ? "Eintrag" : "Einträge"} gefunden)
                </p>
                <table className="history__table">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Start</th>
                      <th>Ende</th>
                      <th>Arbeitszeit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTrackings.map((tracking, index) => {
                      return (
                        <tr key={index}>
                          <td>{new Date(tracking.day).toLocaleDateString()}</td>
                          <td>{new Date(tracking.start).toLocaleTimeString()}</td>
                          <td>{new Date(tracking.end).toLocaleTimeString()}</td>
                          <td>
                            {msToTime(tracking.duration)} (
                            {timeFrameInPercent(tracking.duration, settings?.dailyWork || 8)})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </dialog>
        </>
      )}
    </>
  );
};
