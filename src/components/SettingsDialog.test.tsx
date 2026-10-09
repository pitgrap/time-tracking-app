import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SettingsDialog } from "./SettingsDialog";
import { AppContextProvider, useAppContext } from "../contexts/AppContext";
import { SettingsContextProvider, useSettingsContext } from "../contexts/SettingsContext";
import { TrackingContextProvider } from "../contexts/TrackingContext";
import { initTranslations } from "../utils/Translations";

const OpenSettingsButton: React.FC = () => {
  const { toggleSettings } = useAppContext();
  return <button onClick={toggleSettings}>open</button>;
};

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

    fireEvent.click(screen.getByText("open"));

    // `hidden: true` is required here because the Settings dialog is a
    // <dialog> that's never opened via showModal()/show() (see the native
    // dialog semantics fix) - without the `open` attribute, its content is
    // outside the accessibility tree even though it's visually displayed.
    expect(screen.getAllByRole("checkbox", { hidden: true })).toHaveLength(7);

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
});
