import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTrackingStorage } from "./TrackingStorage";
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
