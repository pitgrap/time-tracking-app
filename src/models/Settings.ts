export interface Settings {
  dailyWork: number;
  dailyPause?: number;
  /**
   * Array of numbers (0=Sunday, 1=Monday, ..., 6=Saturday) representing selected working days.
   * Default: all days checked ([0,1,2,3,4,5,6])
   */
  workingDays?: number[];
}

// Frozen: this exact object can end up as the live `settings` (and
// `settings.workingDays`) reference whenever no value has been saved to
// localStorage yet (see SettingsContext's `?? DEFAULT_SETTINGS`), so an
// in-place mutation anywhere (e.g. `.sort()`ing the array) would silently
// corrupt the shared default for the rest of the session.
export const DEFAULT_SETTINGS: Readonly<Required<Settings>> = Object.freeze({
  dailyWork: 8,
  dailyPause: 0,
  workingDays: Object.freeze([0, 1, 2, 3, 4, 5, 6]) as number[],
});

export interface SettingsContext {
  settings?: Settings;
  updateSettings?: (settings: Settings) => void;
}
