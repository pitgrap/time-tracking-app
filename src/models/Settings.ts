export interface Settings {
  dailyWork: number;
}

export interface SettingsContext {
  settings?: Settings;
  updateSettings?: (settings: Settings) => void;
}
