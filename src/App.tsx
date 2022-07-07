import React from "react";
import { AppContextProvider } from "./contexts/AppContext";
import { SettingsContextProvider } from "./contexts/SettingsContext";
import { Header } from "./components/Header";
import { Tracking } from "./components/Tracking";
import { SettingsDialog } from "./components/SettingsDialog";
import { History } from "./components/History";
import logo from "./assets/logo.svg";
import "./App.css";

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <SettingsContextProvider>
        <div className="app">
          <Header />
          <main className="app-main">
            <h1>Automatische Zeiterfassung</h1>
            <img src={logo} className="app-logo" alt="logo" />
            <Tracking />
          </main>
          <SettingsDialog />
          <History />
        </div>
      </SettingsContextProvider>
    </AppContextProvider>
  );
};

export default App;
