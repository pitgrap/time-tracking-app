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

const App: React.FC = () => {
  const { t } = useTranslation();
  const { settings } = useSettingsContext();
  const today = new Date().getDay();
  const workingDays = settings?.workingDays ?? [0, 1, 2, 3, 4, 5, 6];
  const isWorkingDay = workingDays.includes(today);

  return (
    <AppContextProvider>
      <SettingsContextProvider>
        <div className="app">
          <Header />
          <main className="app-main">
            <h1>{t("title")}</h1>
            <img src={logo} className="app-logo" alt="logo" />
            {isWorkingDay ? <Tracking /> : <DayOffInfo />}
          </main>
          <SettingsDialog />
          <History />
        </div>
      </SettingsContextProvider>
    </AppContextProvider>
  );
};

export default App;
