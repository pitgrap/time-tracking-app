import { useEffect, useState } from "react";
import { DailyTracking } from "../models/DailyTracking";
import { Settings } from "../models/Settings";

export const storageKeyPrefix = "tracking_";

export const getTodayStorageKey = () => {
  const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return `${storageKeyPrefix}${year}-${month}-${day}`;
};

export const useLocalStorage = (storageKey: string, fallbackState: DailyTracking | Settings) => {
  const storedValue = localStorage.getItem(storageKey);
  const existingValue = storedValue ? JSON.parse(storedValue) : undefined;

  const [value, setValue] = useState(existingValue ?? fallbackState);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, value.day, value.start, value.end, value.dailyWork, storageKey]);

  return [value, setValue];
};

export const resetTodayLocalStorage = () => {
  localStorage.setItem("resetToday", "true");
};

export const deleteAllTrackings = () => {
  for (const key in localStorage) {
    if (key.indexOf(storageKeyPrefix) === 0) {
      localStorage.removeItem(key);
    }
  }
};

export const getAllTrackings = (withoutToday = false): Array<DailyTracking> => {
  const allTrackings: Array<DailyTracking> = [];
  const today = new Date().toLocaleDateString();
  const trackingKeys = [];

  for (const key in localStorage) {
    if (key.indexOf(storageKeyPrefix) === 0) {
      trackingKeys.push(key);
    }
  }

  trackingKeys.sort().forEach((key) => {
    const storedTracking = localStorage.getItem(key);
    const existingTracking = storedTracking ? JSON.parse(storedTracking) : undefined;

    if (existingTracking && !(withoutToday && today === new Date(existingTracking.day).toLocaleDateString())) {
      allTrackings.push(existingTracking);
    }
  });

  return allTrackings;
};
