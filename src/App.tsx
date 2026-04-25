import React from "react";
import { useTranslation } from "react-i18next";
import { AppContextProvider } from "./contexts/AppContext";
import { SettingsContextProvider, useSettingsContext } from "./contexts/SettingsContext";
import { initTranslations } from "./utils/Translations";
import { Header } from "./components/Header";
import { Tracking } from "./components/Tracking";
import { SettingsDialog } from "./components/SettingsDialog";
import { History } from "./components/History";
import { DayOffInfo } from "./components/DayOffInfo";
import logo from "./assets/logo.svg";
import "./App.css";

initTranslations();

const MainContent: React.FC = () => {
  const { t } = useTranslation();
  const { settings } = useSettingsContext();
  const today = new Date().getDay();
  const workingDays = settings?.workingDays ?? [0, 1, 2, 3, 4, 5, 6];
  const isWorkingDay = workingDays.includes(today);
  return (
    <main className="app-main">
      <h1>{t("title")}</h1>
      <img src={logo} className="app-logo" alt="logo" />
      {isWorkingDay ? <Tracking /> : <DayOffInfo />}
    </main>
  );
};

const App: React.FC = () => {
  // Version and release link (injected at build time)
  // @ts-expect-error: __APP_VERSION__ is injected by Vite
  const version = __APP_VERSION__;
  return (
    <AppContextProvider>
      <SettingsContextProvider>
        <div className="app">
          <Header />
          <MainContent />
          <SettingsDialog />
          <History />
          <a
            className="app-version"
            href={`https://github.com/pitgrap/time-tracking-app/releases/tag/${version}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`v${version}`}
          >
            v{version}
          </a>
        </div>
      </SettingsContextProvider>
    </AppContextProvider>
  );
};

export default App;
