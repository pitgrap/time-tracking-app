import { t } from "i18next";
import { DailyTracking } from "../models/DailyTracking";
import { msToTime, timeFrameInPercent } from "./Time";

export const generateCSV = (
  allTrackings: Array<DailyTracking>,
  dailyWork = 8,
  dailyPause = 0,
  language = "en",
): Array<Array<string>> => {
  const csvData = [
    [
      t("date"),
      t("start"),
      t("end"),
      dailyPause > 0 ? t("workTime") + " " + t("workTimeWithPause", { break: dailyPause }) : t("workTime"),
      t("workTime") + " in %",
    ],
  ];

  if (allTrackings.length > 0 || dailyWork) {
    allTrackings.forEach((tracking) => {
      csvData.push([
        new Date(tracking.day).toLocaleDateString(language),
        new Date(tracking.start).toLocaleTimeString(language),
        new Date(tracking.end).toLocaleTimeString(language),
        msToTime(tracking.end - tracking.start - dailyPause * 60 * 1000),
        timeFrameInPercent(tracking.end - tracking.start - dailyPause * 60 * 1000, dailyWork),
      ]);
    });
  }
  return csvData;
};
