import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SettingsContextProvider, useSettingsContext } from "./SettingsContext";

const Consumer: React.FC = () => {
  const { settings, updateSettings } = useSettingsContext();
  return (
    <div>
      <span data-testid="dailyWork">{settings?.dailyWork}</span>
      <button onClick={() => updateSettings?.({ ...settings!, dailyWork: (settings?.dailyWork ?? 8) + 1 })}>
        bump
      </button>
    </div>
  );
};

describe("SettingsContextProvider", () => {
  it("reads localStorage only once on mount, not on every re-render", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    render(
      <SettingsContextProvider>
        <Consumer />
      </SettingsContextProvider>,
    );

    const configReads = () => getItemSpy.mock.calls.filter(([key]) => key === "configuration").length;
    expect(configReads()).toBe(1);

    fireEvent.click(screen.getByText("bump"));
    fireEvent.click(screen.getByText("bump"));

    expect(configReads()).toBe(1);
    expect(screen.getByTestId("dailyWork")).toHaveTextContent("10");

    getItemSpy.mockRestore();
  });
});
