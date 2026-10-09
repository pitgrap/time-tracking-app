import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrackingContextProvider, useTrackingContext } from "./TrackingContext";

const Consumer: React.FC = () => {
  const { tracking, resetToday, setCustomStart } = useTrackingContext();
  return (
    <div>
      <span data-testid="start">{tracking.start}</span>
      <span data-testid="end">{tracking.end}</span>
      <button onClick={resetToday}>reset</button>
      <button onClick={() => setCustomStart(123456)}>custom-start</button>
    </div>
  );
};

// Simulates the Settings dialog: it can call resetToday()/setCustomStart()
// without ever rendering the live tracking display.
const SettingsLikeConsumer: React.FC = () => {
  const { resetToday } = useTrackingContext();
  return <button onClick={resetToday}>reset</button>;
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TrackingContextProvider", () => {
  it("clears its ticking interval on unmount", () => {
    vi.useFakeTimers();
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");

    const { unmount } = render(
      <TrackingContextProvider>
        <Consumer />
      </TrackingContextProvider>,
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it("resetToday() applies immediately and persists, without a Tracking view mounted", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 9, 0, 0));

    // Only a settings-like consumer is mounted - nothing reads/displays
    // `tracking`, simulating the real app on a day off where Tracking unmounts
    // (this is exactly the scenario where the old localStorage-flag signal
    // could get orphaned until Tracking happened to mount again).
    render(
      <TrackingContextProvider>
        <SettingsLikeConsumer />
      </TrackingContextProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(60 * 1000);
    });

    act(() => {
      screen.getByText("reset").click();
    });

    const keys = Object.keys(localStorage).filter((key) => key.startsWith("tracking_"));
    expect(keys).toHaveLength(1);
    const stored = JSON.parse(localStorage.getItem(keys[0])!);
    expect(stored.start).toBe(stored.end);
    expect(stored.start).toBe(new Date(2026, 0, 5, 9, 1, 0).getTime());
  });

  it("setCustomStart() updates only the start time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 9, 0, 0));

    render(
      <TrackingContextProvider>
        <Consumer />
      </TrackingContextProvider>,
    );

    const endBefore = screen.getByTestId("end").textContent;

    act(() => {
      screen.getByText("custom-start").click();
    });

    expect(screen.getByTestId("start")).toHaveTextContent("123456");
    expect(screen.getByTestId("end")).toHaveTextContent(endBefore!);
  });
});
