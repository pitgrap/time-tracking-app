import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("App", () => {
  it("switches from Tracking to DayOffInfo once the clock crosses into a non-working day", async () => {
    vi.useFakeTimers();

    const beforeMidnight = new Date(2026, 0, 3, 23, 59, 58);
    const afterMidnight = new Date(2026, 0, 4, 0, 0, 2);
    // Exclude whatever weekday `afterMidnight` falls on - the two dates are
    // always on different weekdays, so `beforeMidnight`'s weekday stays a
    // working day regardless of which real-world dates these are.
    const workingDays = [0, 1, 2, 3, 4, 5, 6].filter((day) => day !== afterMidnight.getDay());
    localStorage.setItem("configuration", JSON.stringify({ dailyWork: 8, dailyPause: 0, workingDays }));

    vi.setSystemTime(beforeMidnight);
    render(<App />);

    expect(screen.getByText("Working time: 00:00 h (0%)")).toBeInTheDocument();
    expect(screen.queryByText("Day Off")).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(afterMidnight.getTime() - beforeMidnight.getTime());
    });

    expect(screen.queryByText(/Working time/)).not.toBeInTheDocument();
    expect(screen.getByText("Day Off")).toBeInTheDocument();
  });
});
