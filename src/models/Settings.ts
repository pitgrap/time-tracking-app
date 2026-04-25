export interface Settings {
  dailyWork: number;
  dailyPause?: number;
  /**
   * Array of numbers (0=Sunday, 1=Monday, ..., 6=Saturday) representing selected working days.
   * Default: all days checked ([0,1,2,3,4,5,6])
   */
  workingDays?: number[];
}
export interface SettingsContext {
  settings?: Settings;
  updateSettings?: (settings: Settings) => void;
}
