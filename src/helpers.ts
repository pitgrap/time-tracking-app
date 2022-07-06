import React from "react";
import { DailyTracking } from "./DailyTracking";

export const useLocalStorage = (storageKey: string, fallbackState: DailyTracking) => {
  const storedValue = localStorage.getItem(storageKey);
  const existingValue = storedValue ? JSON.parse(storedValue) : undefined;

  const [value, setValue] = React.useState(existingValue ?? fallbackState);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, value.end, storageKey]);

  return [value, setValue];
};

export const msToTime = (timeStamp: number) => {
  function pad(number: number) {
    return ("00" + number).slice(-2);
  }

  const ms = timeStamp % 1000;
  timeStamp = (timeStamp - ms) / 1000;
  const secs = timeStamp % 60;
  timeStamp = (timeStamp - secs) / 60;
  const minutes = timeStamp % 60;
  const hours = (timeStamp - minutes) / 60;

  return pad(hours) + ":" + pad(minutes);
};

export const timeFrameInPercent = (timeframe: number, dailyWork: number): string => {
  return Math.round((timeframe / dailyWork) * 100) + "%";
};

export const datetoKey = (date: Date) => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
