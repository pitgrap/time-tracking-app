import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { generateCSV } from "../utils/CSV";
import { getAllTrackings } from "../utils/TrackingStorage";
import { getAverageWorkingTime, hoursToMs, msToTime, timeFrameInPercent } from "../utils/Time";
import { DailyTracking } from "../models/DailyTracking";
import { DEFAULT_SETTINGS } from "../models/Settings";
import { ExportCSV } from "./ExportCSV";
import close from "../assets/close.svg";
import "./History.css";

export const History: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { showHistory, closeHistory } = useAppContext();
  const { settings } = useSettingsContext();

  const dailyWork = settings?.dailyWork ?? DEFAULT_SETTINGS.dailyWork;
  const dailyPause = settings?.dailyPause ?? DEFAULT_SETTINGS.dailyPause;

  const dailyPauseInMs = dailyPause * 60 * 1000;

  // Recomputed only when the dialog is (re)opened or the relevant settings
  // change while it's open - not on every unrelated re-render (e.g. this
  // component used to recompute all of this even if some other part of the
  // app's Context re-rendered it without showHistory actually flipping).
  const { allTrackings, averageWorkTime, csvData, overWork } = useMemo(() => {
    if (!showHistory) {
      return {
        allTrackings: [] as Array<DailyTracking>,
        averageWorkTime: 0,
        csvData: [] as Array<Array<string | number>>,
        overWork: 0,
      };
    }

    const trackings = getAllTrackings();
    const average = getAverageWorkingTime(trackings, dailyPauseInMs);
    const csv = generateCSV(trackings, dailyWork, dailyPause, i18n.language);

    let totalOverWork = 0;
    trackings.forEach((tracking) => {
      totalOverWork = totalOverWork + (tracking.end - tracking.start - dailyPauseInMs);
    });
    totalOverWork = totalOverWork - trackings.length * hoursToMs(dailyWork);

    return { allTrackings: trackings, averageWorkTime: average, csvData: csv, overWork: totalOverWork };
  }, [showHistory, dailyWork, dailyPause, dailyPauseInMs, i18n.language]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  // showHistory is a dependency even though it isn't read in the effect
  // body: the <dialog> only exists in the DOM while showHistory is true
  // (see the conditional render below), so this must re-run whenever that
  // flips in order to pick up the freshly-mounted dialog node via the ref.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const handleClose = () => closeHistory?.();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [showHistory, closeHistory]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      closeHistory?.();
    }
  };

  return (
    <>
      {showHistory && (
        <dialog ref={dialogRef} className="app-history" onClick={handleBackdropClick}>
          <button type="button" className="app__close" onClick={closeHistory}>
            <img src={close} alt={t("close")} title={t("close")} />
          </button>
          <h2>{t("history")}</h2>
          {allTrackings.length === 0 && <p>{t("noHistory")}</p>}
          {allTrackings.length > 0 && (
            <>
              <p>
                {t("workTime")}: {msToTime(hoursToMs(dailyWork))} h
                {!!dailyPause && <> {t("workTimeWithPause", { break: dailyPause })}</>}
                <br />
                {t("averageWorkTime")}:{" "}
                <b>
                  {msToTime(averageWorkTime)} h ({timeFrameInPercent(averageWorkTime, dailyWork)})
                </b>
              </p>
              <p>
                {t("overtime")}: <b>{msToTime(overWork)} h</b>
              </p>
              <p>
                <ExportCSV data={csvData} fileName={"time-tracking-history.csv"} />
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
                          {msToTime(tracking.end - tracking.start - dailyPauseInMs)} h (
                          {timeFrameInPercent(tracking.end - tracking.start - dailyPauseInMs, dailyWork)})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p>
                {allTrackings.length} {allTrackings.length === 1 ? t("entry") : t("entries")} {t("found")}
              </p>
            </>
          )}
        </dialog>
      )}
    </>
  );
};
