import React from "react";
import { useTranslation } from "react-i18next";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useTrackingContext } from "../contexts/TrackingContext";
import { DEFAULT_SETTINGS } from "../models/Settings";
import { msToTime, timeFrameInPercent } from "../utils/Time";

export const Tracking: React.FC = () => {
  const { settings } = useSettingsContext();
  const { t, i18n } = useTranslation();
  const { tracking } = useTrackingContext();

  const dailyWork = settings?.dailyWork ?? DEFAULT_SETTINGS.dailyWork;
  const dailyPause = settings?.dailyPause ?? DEFAULT_SETTINGS.dailyPause;
  const dailyWorkMs = dailyWork * 60 * 60 * 1000;
  const dailyPauseMs = dailyPause * 60 * 1000;

  const trackingDuration = tracking.end - tracking.start;
  const trackingWithPause = trackingDuration - dailyPauseMs;
  const moreTrackingWithPause = !!dailyPause && trackingDuration > dailyPauseMs;
  const projectedEnd = tracking.start + dailyWorkMs + dailyPauseMs;

  // Helper to get color class based on percent
  const getTrackingClass = (percent: number) => {
    if (percent >= 100) return "tracking-over";
    if (percent >= 90) return "tracking-warning";
    return "";
  };

  const percent = (trackingDuration / dailyWorkMs) * 100;
  const percentWithPause = (trackingWithPause / dailyWorkMs) * 100;

  return (
    <>
      <h2>
        {new Date(tracking.day).toLocaleDateString(i18n.language, { weekday: "long" })},{" "}
        {new Date(tracking.day).toLocaleDateString(i18n.language)}
      </h2>
      <div className="app-overview">
        <span className="app-overview__label">{t("start")}</span>
        <time className="app-overview__value">{new Date(tracking.start).toLocaleTimeString(i18n.language)}</time>

        <span className="app-overview__label">{t("now")}</span>
        <time className="app-overview__value">{new Date(tracking.end).toLocaleTimeString(i18n.language)}</time>

        <hr className="app-overview__divider" />

        <span className="app-overview__label">{t("end")}</span>
        <time className="app-overview__value app-overview__value--muted">
          {new Date(projectedEnd).toLocaleTimeString(i18n.language)}
        </time>
      </div>
      <p>
        {!moreTrackingWithPause && (
          <span className={`app-time ${getTrackingClass(percent)}`}>
            {t("workTime")}: {msToTime(trackingDuration)} h ({timeFrameInPercent(trackingDuration, dailyWork)})
          </span>
        )}
        {!!dailyPause && moreTrackingWithPause && (
          <span className={`app-time ${getTrackingClass(percentWithPause)}`}>
            {t("workTime")}: {msToTime(trackingWithPause)} h ({timeFrameInPercent(trackingWithPause, dailyWork)})
            <br />
            {t("workTimeWithPause", { break: dailyPause })}
          </span>
        )}
      </p>
    </>
  );
};
