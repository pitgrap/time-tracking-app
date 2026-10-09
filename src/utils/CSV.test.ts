import { beforeAll, describe, expect, it } from "vitest";
import { generateCSV } from "./CSV";
import { initTranslations } from "./Translations";
import { DailyTracking } from "../models/DailyTracking";

beforeAll(() => {
  initTranslations();
});

describe("generateCSV", () => {
  it("creates a header row plus one row per tracking", () => {
    const trackings: Array<DailyTracking> = [
      {
        day: new Date(2026, 0, 5),
        start: new Date(2026, 0, 5, 9, 0).getTime(),
        end: new Date(2026, 0, 5, 17, 0).getTime(),
      },
    ];

    const csv = generateCSV(trackings, 8, 0, "en");

    expect(csv).toHaveLength(2);
    expect(csv[0]).toHaveLength(5);
    expect(csv[1][3]).toBe("08:00");
    expect(csv[1][4]).toBe("100%");
  });

  it("subtracts the configured pause from the work-time column", () => {
    const trackings: Array<DailyTracking> = [
      {
        day: new Date(2026, 0, 5),
        start: new Date(2026, 0, 5, 9, 0).getTime(),
        end: new Date(2026, 0, 5, 17, 0).getTime(),
      },
    ];

    const csv = generateCSV(trackings, 8, 30, "en");

    expect(csv[1][3]).toBe("07:30");
  });

  it("still emits a header row when there are no trackings", () => {
    const csv = generateCSV([], 8, 0, "en");
    expect(csv).toHaveLength(1);
  });
});
