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

  const trackingDuration = tracking.end - tracking.start;
  const trackingWithPause = trackingDuration - (settings?.dailyPause || 0) * 60 * 1000;
  const moreTrackingWithPause = !!settings?.dailyPause && trackingDuration > (settings?.dailyPause || 0) * 60 * 1000;

  return (
    <>
      <h2>
        {new Date(tracking.day).toLocaleDateString(i18n.language, { weekday: "long" })},{" "}
        {new Date(tracking.day).toLocaleDateString(i18n.language)}
      </h2>
      <p className="app-overview">
        {t("start")}: <time className="app-time">{new Date(tracking.start).toLocaleTimeString(i18n.language)}</time>
        <br />
        {t("end")}: <time className="app-time">{new Date(tracking.end).toLocaleTimeString(i18n.language)}</time>
      </p>
      <p>
        {!moreTrackingWithPause && (
          <>
            {t("workTime")}: {msToTime(trackingDuration)} h (
            {timeFrameInPercent(trackingDuration, settings?.dailyWork || 8)})
          </>
        )}

        {!!settings?.dailyPause && moreTrackingWithPause && (
          <>
            {t("workTime")}: {msToTime(trackingDuration - settings.dailyPause * 60 * 1000)} h (
            {timeFrameInPercent(trackingWithPause, settings?.dailyWork || 8)})<br />
            {t("workTimeWithPause", { break: settings.dailyPause })}
          </>
        )}
      </p>
    </>
  );
};
