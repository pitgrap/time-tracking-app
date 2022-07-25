import React from "react";
import { AppContextProvider } from "./contexts/AppContext";
import { SettingsContextProvider } from "./contexts/SettingsContext";
import { Header } from "./components/Header";
import { Tracking } from "./components/Tracking";
import { SettingsDialog } from "./components/SettingsDialog";
import { History } from "./components/History";
import logo from "./assets/logo.svg";
import "./App.css";
import "./utils/Translations";
import { useTranslation } from "react-i18next";

const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AppContextProvider>
      <SettingsContextProvider>
        <div className="app">
          <Header />
          <main className="app-main">
            <h1>{t("title")}</h1>
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
