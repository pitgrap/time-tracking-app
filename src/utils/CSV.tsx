import { t } from "i18next";
import { DailyTracking } from "../models/DailyTracking";
import { msToTime, timeFrameInPercent } from "./Time";

export const generateCSV = (
  allTrackings: Array<DailyTracking>,
  dailyWork = 8,
  language = "en"
): Array<Array<string>> => {
  const csvData = [[t("date"), t("start"), t("end"), t("workTime"), t("workTime") + " in %"]];

  if (allTrackings.length > 0 || dailyWork) {
    allTrackings.forEach((tracking) => {
      csvData.push([
        new Date(tracking.day).toLocaleDateString(language),
        new Date(tracking.start).toLocaleTimeString(language),
        new Date(tracking.end).toLocaleTimeString(language),
        msToTime(tracking.end - tracking.start),
        timeFrameInPercent(tracking.end - tracking.start, dailyWork),
      ]);
    });
  }
  return csvData;
};
