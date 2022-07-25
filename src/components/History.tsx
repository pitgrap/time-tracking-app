import React from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useCloseOnEsc } from "../utils/UI";
import { getAllTrackings } from "../utils/LocalStorage";
import { msToTime, timeFrameInPercent } from "../utils/Time";
import { DailyTracking } from "../models/DailyTracking";
import close from "../assets/close.svg";
import "./History.css";

export const History: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { showHistory, toggleHistory } = useAppContext();
  const { settings } = useSettingsContext();

  let allTrackings: Array<DailyTracking> = [];
  if (showHistory) {
    allTrackings = getAllTrackings(true);
  }

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
              <img src={close} alt={t("close")} title={t("close")} />
            </span>
            <h2>{t("history")}</h2>
            {allTrackings.length === 0 && <p>{t("noHistory")}</p>}
            {allTrackings.length > 0 && (
              <>
                <p>
                  ({allTrackings.length} {allTrackings.length === 1 ? t("entry") : t("entries")} {t("found")})
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
