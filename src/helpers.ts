import React from "react";

export const useLocalStorage = (storageKey: string, fallbackState: number) => {
  const storedValue = localStorage.getItem(storageKey);
  const existingValue = storedValue ? JSON.parse(storedValue) : undefined;

  const [value, setValue] = React.useState(existingValue ?? fallbackState);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};

export const msToTime = (timeStamp: number) => {
  // Pad to 2 or 3 digits, default is 2
  function pad(number: number, z = 2) {
    return ("00" + number).slice(-z);
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
