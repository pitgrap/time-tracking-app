import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tracking } from "./Tracking";
import { SettingsContextProvider } from "../contexts/SettingsContext";
import { initTranslations } from "../utils/Translations";
import { resetTodayLocalStorage } from "../utils/TrackingStorage";

beforeEach(() => {
  initTranslations();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Tracking", () => {
  it("clears its ticking interval on unmount", () => {
    vi.useFakeTimers();
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");

    const { unmount } = render(
      <SettingsContextProvider>
        <Tracking />
      </SettingsContextProvider>,
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });

  it("ticks the displayed work time forward and persists it to localStorage", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 9, 0, 0));

    render(
      <SettingsContextProvider>
        <Tracking />
      </SettingsContextProvider>,
    );

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

  it("applies a pending reset-today signal on the next tick without losing the running clock", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 9, 0, 0));

    render(
      <SettingsContextProvider>
        <Tracking />
      </SettingsContextProvider>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    });
    expect(screen.getByText("Working time: 00:05 h (1%)")).toBeInTheDocument();

    resetTodayLocalStorage();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText("Working time: 00:00 h (0%)")).toBeInTheDocument();
    expect(localStorage.getItem("resetToday")).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(screen.getByText("Working time: 00:00 h (0%)")).toBeInTheDocument();
  });
});
