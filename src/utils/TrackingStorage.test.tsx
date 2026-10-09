import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { advanceTracking, useTrackingStorage } from "./TrackingStorage";
import { DailyTracking } from "../models/DailyTracking";

const TestComponent: React.FC<{ fallback: DailyTracking }> = ({ fallback }) => {
  const [value, setValue] = useTrackingStorage(fallback);
  return (
    <div>
      <span data-testid="end">{value.end}</span>
      <button onClick={() => setValue((prev: DailyTracking) => ({ ...prev, end: prev.end + 1 }))}>tick</button>
    </div>
  );
};

describe("useTrackingStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads localStorage only once on mount, not on every re-render", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    const fallback: DailyTracking = { day: new Date(), start: 1000, end: 1000 };

    render(<TestComponent fallback={fallback} />);
    expect(getItemSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("tick"));
    fireEvent.click(screen.getByText("tick"));

    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("end")).toHaveTextContent("1002");

    getItemSpy.mockRestore();
  });

  it("persists value changes to localStorage under today's key", () => {
    const fallback: DailyTracking = { day: new Date(), start: 1000, end: 1000 };
    render(<TestComponent fallback={fallback} />);

    fireEvent.click(screen.getByText("tick"));

    const keys = Object.keys(localStorage).filter((key) => key.startsWith("tracking_"));
    expect(keys).toHaveLength(1);
    const stored = JSON.parse(localStorage.getItem(keys[0])!);
    expect(stored.end).toBe(1001);
  });
});

describe("advanceTracking", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("bumps end to the current time on a normal tick, without mutating the input", () => {
    const previous: DailyTracking = { day: new Date(2026, 0, 5), start: 1000, end: 1000 };
    const now = new Date(2026, 0, 5, 0, 0, 2);

    const next = advanceTracking(previous, now);

    expect(next).not.toBe(previous);
    expect(previous.end).toBe(1000); // input untouched
    expect(next.start).toBe(1000);
    expect(next.end).toBe(now.getTime());
  });

  it("returns the same reference when nothing changed, so React can bail out", () => {
    const now = new Date(2026, 0, 5, 10, 0, 0);
    const previous: DailyTracking = { day: now, start: now.getTime(), end: now.getTime() };

    expect(advanceTracking(previous, now)).toBe(previous);
  });

  it("applies a pending reset-today signal and clears it", () => {
    localStorage.setItem("resetToday", "true");
    const previous: DailyTracking = { day: new Date(2026, 0, 5), start: 1000, end: 5000 };
    const now = new Date(2026, 0, 5, 10, 0, 0);

    const next = advanceTracking(previous, now);

    expect(next.start).toBe(now.getTime());
    expect(next.end).toBe(now.getTime());
    expect(localStorage.getItem("resetToday")).toBeNull();
  });

  it("applies a pending custom-start signal and clears it", () => {
    const customStart = new Date(2026, 0, 5, 7, 30, 0).getTime();
    localStorage.setItem("customStart", customStart.toString());
    const previous: DailyTracking = { day: new Date(2026, 0, 5), start: 1000, end: 5000 };
    const now = new Date(2026, 0, 5, 10, 0, 0);

    const next = advanceTracking(previous, now);

    expect(next.start).toBe(customStart);
    expect(next.end).toBe(now.getTime());
    expect(localStorage.getItem("customStart")).toBeNull();
  });

  it("starts a fresh tracking record once the day has rolled over", () => {
    const previous: DailyTracking = { day: new Date(2026, 0, 5, 23, 59, 59), start: 1000, end: 2000 };
    const now = new Date(2026, 0, 6, 0, 0, 1);

    const next = advanceTracking(previous, now);

    expect(new Date(next.day).toDateString()).toBe(now.toDateString());
    expect(next.start).toBe(now.getTime());
    expect(next.end).toBe(now.getTime());
  });
});
