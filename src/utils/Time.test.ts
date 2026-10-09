import { describe, expect, it } from "vitest";
import { getAverageWorkingTime, hoursToMs, msToTime, timeFrameInPercent, transformTimeToDate } from "./Time";

describe("msToTime", () => {
  it("formats positive durations as HH:MM", () => {
    expect(msToTime(0)).toBe("00:00");
    expect(msToTime(90 * 60 * 1000)).toBe("01:30");
  });

  it("formats negative durations with a leading minus sign", () => {
    expect(msToTime(-90 * 60 * 1000)).toBe("-01:30");
  });
});

describe("hoursToMs", () => {
  it("converts hours to milliseconds", () => {
    expect(hoursToMs(1)).toBe(60 * 60 * 1000);
    expect(hoursToMs(8)).toBe(8 * 60 * 60 * 1000);
  });
});

describe("timeFrameInPercent", () => {
  it("computes the percentage of a configured daily work time", () => {
    expect(timeFrameInPercent(hoursToMs(4), 8)).toBe("50%");
    expect(timeFrameInPercent(hoursToMs(8), 8)).toBe("100%");
  });
});

describe("getAverageWorkingTime", () => {
  it("averages (end - start - pause) across trackings", () => {
    const trackings = [
      { day: new Date(), start: 0, end: hoursToMs(8) },
      { day: new Date(), start: 0, end: hoursToMs(6) },
    ];
    expect(getAverageWorkingTime(trackings, 0)).toBe(hoursToMs(7));
  });

  it("subtracts the daily pause from each tracking before averaging", () => {
    const trackings = [{ day: new Date(), start: 0, end: hoursToMs(8) }];
    expect(getAverageWorkingTime(trackings, hoursToMs(1))).toBe(hoursToMs(7));
  });

  it("returns 0 instead of NaN for an empty list", () => {
    expect(getAverageWorkingTime([], 0)).toBe(0);
    expect(getAverageWorkingTime()).toBe(0);
  });
});

describe("transformTimeToDate", () => {
  it("applies a HH:MM time string onto a given date", () => {
    const date = new Date(2026, 0, 1, 0, 0, 0);
    const result = transformTimeToDate("09:30", date);
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(30);
  });

  it("defaults missing hour/minute/second parts to 0", () => {
    const date = new Date(2026, 0, 1, 12, 15, 45);
    const result = transformTimeToDate("", date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});
