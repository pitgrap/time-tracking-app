import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tracking } from "./Tracking";
import { SettingsContextProvider } from "../contexts/SettingsContext";
import { TrackingContextProvider, useTrackingContext } from "../contexts/TrackingContext";
import { initTranslations } from "../utils/Translations";

const ResetButton: React.FC = () => {
  const { resetToday } = useTrackingContext();
  return <button onClick={resetToday}>reset</button>;
};

const renderTracking = () =>
  render(
    <SettingsContextProvider>
      <TrackingContextProvider>
        <Tracking />
        <ResetButton />
      </TrackingContextProvider>
    </SettingsContextProvider>,
  );

beforeEach(() => {
  initTranslations();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Tracking", () => {
  it("ticks the displayed work time forward and persists it to localStorage", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 9, 0, 0));

    renderTracking();

    expect(screen.getByText("Working time: 00:00 h (0%)")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(65 * 1000);
    });

    expect(screen.getByText("Working time: 00:01 h (0%)")).toBeInTheDocument();

    const keys = Object.keys(localStorage).filter((key) => key.startsWith("tracking_"));
    expect(keys).toHaveLength(1);
    const stored = JSON.parse(localStorage.getItem(keys[0])!);
    expect(stored.end - stored.start).toBe(65 * 1000);
  });

  it("reflects a reset triggered elsewhere (e.g. the Settings dialog) immediately", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 9, 0, 0));

    renderTracking();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    });
    expect(screen.getByText("Working time: 00:05 h (1%)")).toBeInTheDocument();

    act(() => {
      screen.getByText("reset").click();
    });

    expect(screen.getByText("Working time: 00:00 h (0%)")).toBeInTheDocument();
  });
});
