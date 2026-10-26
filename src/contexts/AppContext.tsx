import React, { useCallback, useState } from "react";
import { AppContext, Props } from "../models/App";

const appContext = React.createContext<AppContext | undefined>(undefined);

export const useAppContext = (): AppContext => {
  const context = React.useContext(appContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // stable identities: consumed by dialogs to sync with native <dialog>
  // close events (ESC), where an identity change would re-fire the
  // showModal() mount effect and throw on an already-open dialog
  const openSettings = useCallback(() => setShowSettings(true), []);
  const closeSettings = useCallback(() => setShowSettings(false), []);
  const openHistory = useCallback(() => setShowHistory(true), []);
  const closeHistory = useCallback(() => setShowHistory(false), []);

  return (
    <appContext.Provider value={{ showSettings, openSettings, closeSettings, showHistory, openHistory, closeHistory }}>
      {children}
    </appContext.Provider>
  );
};
