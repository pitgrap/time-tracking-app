import React from "react";
import { useTranslation } from "react-i18next";
import { AppContextProvider } from "./contexts/AppContext";
import { SettingsContextProvider, useSettingsContext } from "./contexts/SettingsContext";
import { TrackingContextProvider, useTrackingContext } from "./contexts/TrackingContext";
import { DEFAULT_SETTINGS } from "./models/Settings";
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
  // reuses TrackingContext's ticking clock so a day change (e.g. crossing
  // from a working day into a day off overnight) is picked up while the tab
  // stays open, instead of only on the next unrelated re-render
  const { now } = useTrackingContext();
  const today = now.getDay();
  const workingDays = settings?.workingDays ?? DEFAULT_SETTINGS.workingDays;
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
        <TrackingContextProvider>
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
        </TrackingContextProvider>
      </SettingsContextProvider>
    </AppContextProvider>
  );
};

export default App;
