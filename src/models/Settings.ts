export interface Settings {
  dailyWork: number;
  dailyPause?: number;
}

export interface SettingsContext {
  settings?: Settings;
  updateSettings?: (settings: Settings) => void;
}
