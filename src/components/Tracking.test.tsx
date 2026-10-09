import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Tracking } from "./Tracking";
import { SettingsContextProvider } from "../contexts/SettingsContext";
import { initTranslations } from "../utils/Translations";

beforeEach(() => {
  initTranslations();
  localStorage.clear();
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
    vi.useRealTimers();
  });
});
