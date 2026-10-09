import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "./Settings";

describe("DEFAULT_SETTINGS", () => {
  it("is frozen so it can't be corrupted by an in-place mutation", () => {
    expect(Object.isFrozen(DEFAULT_SETTINGS)).toBe(true);
    expect(Object.isFrozen(DEFAULT_SETTINGS.workingDays)).toBe(true);

    expect(() => {
      // @ts-expect-error intentionally violating the readonly contract to test the runtime freeze
      DEFAULT_SETTINGS.dailyWork = 0;
    }).toThrow();

    expect(() => {
      DEFAULT_SETTINGS.workingDays.sort();
    }).toThrow();
  });
});
