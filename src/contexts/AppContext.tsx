import React, { useState } from "react";
import { AppContext, Props } from "../models/App";

const appContext = React.createContext<AppContext>({
  showSettings: false,
  showHistory: false,
});

export const useAppContext = () => {
  const context = React.useContext(appContext);
  if (context === undefined) {
    throw new Error("useSettingsContextState must be used within a SettingsContextProvider");
  }
  return context;
};

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const toggleShowSettings = () => setShowSettings(!showSettings);
  const toggleShowHistory = () => setShowHistory(!showHistory);

  return (
    <appContext.Provider
      value={{ showSettings, toggleSettings: toggleShowSettings, showHistory, toggleHistory: toggleShowHistory }}
    >
      {children}
    </appContext.Provider>
  );
};
