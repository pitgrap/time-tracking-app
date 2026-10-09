import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DailyTracking } from "../models/DailyTracking";
import { safeJsonParse } from "./Json";

const storageKeyPrefix = "tracking_";

// custom hook
export const useTrackingStorage = (
  fallbackState: DailyTracking,
): [DailyTracking, Dispatch<SetStateAction<DailyTracking>>] => {
  const storageKey = getTodayStorageKey();

  // lazy initializer: only reads/parses localStorage once, on mount
  const [value, setValue] = useState(() => {
    const existingValue = safeJsonParse<DailyTracking>(localStorage.getItem(storageKey));
    return existingValue ?? fallbackState;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};

/**
 * Computes the next tracking record for a tick of the clock: handles the day
 * rolling over while the tab stays open, otherwise bumps `end` to now.
 * Returns `previous` unchanged when nothing needs to update, so React can
 * bail out of re-rendering.
 */
export const advanceTracking = (previous: DailyTracking, now: Date): DailyTracking => {
  const nowMs = now.getTime();

  if (new Date(previous.day).toLocaleDateString() !== now.toLocaleDateString()) {
    return { day: now, start: nowMs, end: nowMs };
  }

  if (previous.end === nowMs) {
    return previous;
  }

  return { ...previous, end: nowMs };
};

const getTodayStorageKey = () => {
  const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return `${storageKeyPrefix}${year}-${month}-${day}`;
};

export const deleteAllTrackings = () => {
  const keysToDelete: Array<string> = [];

  for (const key in localStorage) {
    if (key.indexOf(storageKeyPrefix) === 0) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => localStorage.removeItem(key));
};

export const getAllTrackings = (withoutToday = true): Array<DailyTracking> => {
  const allTrackings: Array<DailyTracking> = [];
  const today = new Date().toLocaleDateString();
  const trackingKeys = [];

  for (const key in localStorage) {
    if (key.indexOf(storageKeyPrefix) === 0) {
      trackingKeys.push(key);
    }
  }

  trackingKeys
    .sort()
    .reverse()
    .forEach((key) => {
      const existingTracking = safeJsonParse<DailyTracking>(localStorage.getItem(key));

      if (existingTracking && !(withoutToday && today === new Date(existingTracking.day).toLocaleDateString())) {
        allTrackings.push(existingTracking);
      }
    });

  return allTrackings;
};
