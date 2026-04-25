import React, { useContext, useState } from "react";
import { Props } from "../models/App";
import { Settings, SettingsContext } from "../models/Settings";

// create context with no default
const settingsContext = React.createContext<SettingsContext>({});

// custom context consumer hook
export const useSettingsContext = () => {
  const context = useContext(settingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContextState must be used within a SettingsContextProvider");
  }
  return context;
};

// custom provider
export const SettingsContextProvider: React.FC<Props> = ({ children }) => {
  // get settings from local storage
  const storageKey = "configuration";
  const storedSettings = localStorage.getItem(storageKey);
  const existingSettings = storedSettings ? JSON.parse(storedSettings) : undefined;

  const defaultSettings: Settings = {
    dailyWork: 8,
    dailyPause: 0,
    workingDays: [0, 1, 2, 3, 4, 5, 6], // All days checked by default
  };

  // the settings that will be given to the context
  const [settings, setSettings] = useState<Settings>(existingSettings ?? defaultSettings);

  // update the settings in localStorage
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(storageKey, JSON.stringify(newSettings));
  };

  // the Provider gives access to the context to its children
  return <settingsContext.Provider value={{ settings, updateSettings }}>{children}</settingsContext.Provider>;
};
