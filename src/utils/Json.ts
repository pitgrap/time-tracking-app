/**
 * Parses a stored JSON string, returning undefined for null/empty input or
 * malformed JSON instead of throwing - guards against corrupted or
 * hand-edited localStorage values crashing the app on load.
 */
export const safeJsonParse = <T>(value: string | null): T | undefined => {
  if (!value) {
    return undefined;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
};
