import React from "react";
import { Props } from "../models/App";
import { Settings, SettingsContext } from "../models/Settings";
import { useLocalStorage } from "../utils/LocalStorage";

const settingsContext = React.createContext<SettingsContext>({});

export const useSettingsContext = () => {
  const context = React.useContext(settingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContextState must be used within a SettingsContextProvider");
  }
  return context;
};

export const SettingsContextProvider: React.FC<Props> = ({ children }) => {
  const storageKey = "configuration";
  const initSettings: Settings = {
    dailyWork: 8,
  };

  const [settings, setSettings] = useLocalStorage(storageKey, initSettings);

  return (
    <settingsContext.Provider value={{ settings, updateSettings: setSettings }}>{children}</settingsContext.Provider>
  );
};
