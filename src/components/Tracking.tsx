import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettingsContext } from "../contexts/SettingsContext";
import { DailyTracking } from "../models/DailyTracking";
import { useTrackingStorage } from "../utils/TrackingStorage";
import { msToTime, timeFrameInPercent } from "../utils/Time";

export const Tracking: React.FC = () => {
  const { settings } = useSettingsContext();
  const { t, i18n } = useTranslation();

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
  };

  const [tracking] = useTrackingStorage(initTracking);
  // reset today
  if (localStorage.getItem("resetToday") === "true") {
    tracking.start = now.getTime();
    localStorage.removeItem("resetToday");
  }
  // crossed midnight
  if (new Date(tracking.day).toLocaleDateString() !== new Date().toLocaleDateString()) {
    tracking.day = new Date();
    tracking.start = now.getTime();
  }
  // update tracking
  if (tracking.end !== now.getTime()) {
    tracking.end = now.getTime();
  }
  // update by custom input
  if (localStorage.getItem("customStart")) {
    tracking.start = parseInt(localStorage.getItem("customStart") || "");
    localStorage.removeItem("customStart");
  }

  const dailyWorkMs = (settings?.dailyWork || 8) * 60 * 60 * 1000;
  const dailyPauseMs = (settings?.dailyPause || 0) * 60 * 1000;

  const trackingDuration = tracking.end - tracking.start;
  const trackingWithPause = trackingDuration - dailyPauseMs;
  const moreTrackingWithPause = !!settings?.dailyPause && trackingDuration > dailyPauseMs;
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
            {t("workTime")}: {msToTime(trackingDuration)} h (
            {timeFrameInPercent(trackingDuration, settings?.dailyWork || 8)})
          </span>
        )}
        {!!settings?.dailyPause && moreTrackingWithPause && (
          <span className={`app-time ${getTrackingClass(percentWithPause)}`}>
            {t("workTime")}: {msToTime(trackingWithPause)} h (
            {timeFrameInPercent(trackingWithPause, settings?.dailyWork || 8)})<br />
            {t("workTimeWithPause", { break: settings.dailyPause })}
          </span>
        )}
      </p>
    </>
  );
};
