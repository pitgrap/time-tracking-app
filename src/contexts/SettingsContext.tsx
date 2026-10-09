import React, { useContext, useState } from "react";
import { Props } from "../models/App";
import { DEFAULT_SETTINGS, Settings, SettingsContext } from "../models/Settings";

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
  const storageKey = "configuration";

  // the settings that will be given to the context
  // lazy initializer: only reads/parses localStorage once, on mount
  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem(storageKey);
    const existingSettings = storedSettings ? JSON.parse(storedSettings) : undefined;

    return existingSettings ?? DEFAULT_SETTINGS;
  });

  // update the settings in localStorage
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(storageKey, JSON.stringify(newSettings));
  };

  // the Provider gives access to the context to its children
  return <settingsContext.Provider value={{ settings, updateSettings }}>{children}</settingsContext.Provider>;
};
