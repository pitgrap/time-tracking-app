import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SettingsDialog } from "./SettingsDialog";
import { AppContextProvider, useAppContext } from "../contexts/AppContext";
import { SettingsContextProvider, useSettingsContext } from "../contexts/SettingsContext";
import { TrackingContextProvider } from "../contexts/TrackingContext";
import { initTranslations } from "../utils/Translations";

const OpenSettingsButton: React.FC = () => {
  const { openSettings } = useAppContext();
  return <button onClick={openSettings}>open</button>;
};

const renderSettings = () =>
  render(
    <AppContextProvider>
      <SettingsContextProvider>
        <TrackingContextProvider>
          <OpenSettingsButton />
          <SettingsDialog />
        </TrackingContextProvider>
      </SettingsContextProvider>
    </AppContextProvider>,
  );

const DailyWorkDisplay: React.FC = () => {
  const { settings } = useSettingsContext();
  return <span data-testid="dailyWorkValue">{settings?.dailyWork}</span>;
};

beforeEach(() => {
  initTranslations();
  localStorage.clear();
});

describe("SettingsDialog", () => {
  it("renders the weekday checkboxes without a missing/duplicate key warning", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderSettings();

    fireEvent.click(screen.getByText("open"));

    expect(screen.getAllByRole("checkbox")).toHaveLength(7);

    const keyWarnings = errorSpy.mock.calls.filter(
      ([message]) => typeof message === "string" && message.includes("unique") && message.includes("key"),
    );
    expect(keyWarnings).toHaveLength(0);

    errorSpy.mockRestore();
  });

  it("propagates a daily-work-hours change to other SettingsContext consumers", () => {
    const { container } = render(
      <AppContextProvider>
        <SettingsContextProvider>
          <TrackingContextProvider>
            <OpenSettingsButton />
            <DailyWorkDisplay />
            <SettingsDialog />
          </TrackingContextProvider>
        </SettingsContextProvider>
      </AppContextProvider>,
    );

    fireEvent.click(screen.getByText("open"));
    expect(screen.getByTestId("dailyWorkValue")).toHaveTextContent("8");

    const input = container.querySelector<HTMLInputElement>("#dailyWork")!;
    fireEvent.change(input, { target: { value: "6" } });

    expect(screen.getByTestId("dailyWorkValue")).toHaveTextContent("6");
    expect(JSON.parse(localStorage.getItem("configuration")!).dailyWork).toBe(6);
  });

  it("opens via the native showModal() API", () => {
    renderSettings();
    fireEvent.click(screen.getByText("open"));

    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(true);
  });

  it("closes when the backdrop (not the dialog content) is clicked", () => {
    renderSettings();
    fireEvent.click(screen.getByText("open"));

    const dialog = document.querySelector("dialog")!;
    fireEvent.click(dialog);

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });

  it("does not close when clicking inside the dialog content", () => {
    renderSettings();
    fireEvent.click(screen.getByText("open"));

    fireEvent.click(screen.getByText("Settings"));

    expect(document.querySelector("dialog")).toBeInTheDocument();
  });

  it("closes via the close (X) button", () => {
    renderSettings();
    fireEvent.click(screen.getByText("open"));

    fireEvent.click(screen.getByTitle("Close"));

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });

  it("stays in sync when the dialog is closed natively (e.g. via ESC)", () => {
    renderSettings();
    fireEvent.click(screen.getByText("open"));

    const dialog = document.querySelector("dialog")!;
    // Simulates what a real browser does on ESC for a showModal() dialog -
    // fires the native "close" event, which our effect listens for.
    fireEvent(dialog, new Event("close"));

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });
});
