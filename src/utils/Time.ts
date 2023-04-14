import { DailyTracking } from "../models/DailyTracking";

export const msToTime = (timeStamp: number) => {
  function pad(number: number) {
    return ("00" + number).slice(-2);
  }

  let negativeTime = false;
  if (timeStamp < 0) {
    negativeTime = true;
    timeStamp = timeStamp * -1;
  }

  const ms = timeStamp % 1000;
  timeStamp = (timeStamp - ms) / 1000;
  const secs = timeStamp % 60;
  timeStamp = (timeStamp - secs) / 60;
  const minutes = timeStamp % 60;
  const hours = (timeStamp - minutes) / 60;

  return (negativeTime ? "-" : "") + pad(hours) + ":" + pad(minutes);
};

export const hoursToMs = (hours: number) => {
  return 1000 * 60 * 60 * hours;
};

export const timeFrameInPercent = (timeframe: number, dailyWork: number): string => {
  return Math.round((timeframe / hoursToMs(dailyWork)) * 100) + "%";
};

export const getAverageWorkingTime = (trackings: Array<DailyTracking> = [], dailyPause = 0): number => {
  let allWorkTimes = 0;
  trackings.forEach((tracking) => {
    allWorkTimes = allWorkTimes + (tracking.end - tracking.start - dailyPause);
  });
  return Math.round(allWorkTimes / trackings.length);
};

export const transformTimeToDate = (timeString: string, wantedDate: Date): Date => {
  const splitTimeString = timeString.split(":");
  const [hours, minutes, seconds] = splitTimeString.map(Number);
  const date = wantedDate;
  date.setHours(hours || 0);
  date.setMinutes(minutes || 0);
  date.setSeconds(seconds || 0);
  return date;
};
