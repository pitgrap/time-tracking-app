import { describe, expect, it } from "vitest";
import { safeJsonParse } from "./Json";

describe("safeJsonParse", () => {
  it("parses valid JSON", () => {
    expect(safeJsonParse<{ a: number }>('{"a":1}')).toEqual({ a: 1 });
  });

  it("returns undefined for null input", () => {
    expect(safeJsonParse(null)).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(safeJsonParse("")).toBeUndefined();
  });

  it("returns undefined instead of throwing for malformed JSON", () => {
    expect(safeJsonParse("{not valid json")).toBeUndefined();
  });
});
