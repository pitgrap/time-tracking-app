import React from "react";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { generateCSV } from "../utils/CSV";
import { useCloseOnEsc } from "../utils/UI";
import { getAllTrackings } from "../utils/TrackingStorage";
import { getAverageWorkingTime, hoursToMs, msToTime, timeFrameInPercent } from "../utils/Time";
import { DailyTracking } from "../models/DailyTracking";
import close from "../assets/close.svg";
import "./History.css";

export const History: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { showHistory, toggleHistory } = useAppContext();
  const { settings } = useSettingsContext();

  let allTrackings: Array<DailyTracking> = [];
  let averageWorkTime = 0;
  let csvData: Array<Array<string | number>> = [];
  let overWork = 0;
  if (showHistory) {
    allTrackings = getAllTrackings(true);
    averageWorkTime = getAverageWorkingTime(allTrackings);
    csvData = generateCSV(allTrackings, settings?.dailyWork || 8, i18n.language);

    allTrackings.forEach((tracking) => {
      overWork = overWork + (tracking.end - tracking.start);
    });
    overWork = overWork - allTrackings.length * hoursToMs(settings?.dailyWork || 8);
  }

  // close on esc
  useCloseOnEsc(showHistory, toggleHistory);

  return (
    <>
      {showHistory && (
        <>
          <div className="app__background" onClick={toggleHistory}></div>
          <dialog className="app-history">
            <span className="app__close" onClick={toggleHistory}>
              <img src={close} alt={t("close")} title={t("close")} />
            </span>
            <h2>{t("history")}</h2>
            {allTrackings.length === 0 && <p>{t("noHistory")}</p>}
            {allTrackings.length > 0 && (
              <>
                <p>
                  {t("averageWorkTime")}:{" "}
                  <b>
                    {msToTime(averageWorkTime)} h ({timeFrameInPercent(averageWorkTime, settings?.dailyWork || 8)})
                  </b>
                  <br />
                  {t("overtime")}: {msToTime(overWork)} h
                </p>
                <table className="history__table">
                  <thead>
                    <tr>
                      <th>{t("date")}</th>
                      <th>{t("start")}</th>
                      <th>{t("end")}</th>
                      <th>{t("workTime")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTrackings.map((tracking, index) => {
                      return (
                        <tr key={index}>
                          <td>{new Date(tracking.day).toLocaleDateString(i18n.language)}</td>
                          <td>{new Date(tracking.start).toLocaleTimeString(i18n.language)}</td>
                          <td>{new Date(tracking.end).toLocaleTimeString(i18n.language)}</td>
                          <td>
                            {msToTime(tracking.end - tracking.start)} h (
                            {timeFrameInPercent(tracking.end - tracking.start, settings?.dailyWork || 8)})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p>
                  {allTrackings.length} {allTrackings.length === 1 ? t("entry") : t("entries")} {t("found")}.<br />
                  <CSVLink
                    className="history__download"
                    data={csvData}
                    filename={"time-tracking-history.csv"}
                    separator={";"}
                  >
                    <button>Download (.csv)</button>
                  </CSVLink>
                </p>
              </>
            )}
          </dialog>
        </>
      )}
    </>
  );
};
