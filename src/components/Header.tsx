import React from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/AppContext";
import github from "../assets/github.svg";
import config from "../assets/config.svg";
import history from "../assets/history.svg";
import "./Header.css";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { openSettings, openHistory } = useAppContext();

  return (
    <header className="app-header">
      <a href="https://github.com/pitgrap/time-tracking-app" title="Github">
        <img src={github} alt="Github" />
      </a>
      <button type="button" className="app__button" onClick={openHistory} title={t("showHistory")}>
        <img src={history} className="app__button-history" alt={t("showHistory")} />
      </button>
      <button type="button" className="app__button" onClick={openSettings} title={t("editSettings")}>
        <img src={config} className="app__button-config" alt={t("editSettings")} />
      </button>
    </header>
  );
};
