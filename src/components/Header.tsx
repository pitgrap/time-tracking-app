import React from "react";
import { useAppContext } from "../contexts/AppContext";
import github from "../assets/github.svg";
import config from "../assets/config.svg";
import history from "../assets/history.svg";
import "./Header.css";
import { t } from "i18next";

export const Header: React.FC = () => {
  const { toggleSettings, toggleHistory } = useAppContext();
  return (
    <header className="app-header">
      <a href="https://github.com/pitgrap/time-tracking-app" title="Github">
        <img src={github} alt="Github" />
      </a>
      <span className="app__button" onClick={toggleHistory} title={t("showHistory")}>
        <img src={history} className="app__button-history" alt={t("showHistory")} />
      </span>
      <span className="app__button" onClick={toggleSettings} title={t("editSettings")}>
        <img src={config} className="app__button-config" alt={t("editSettings")} />
      </span>
    </header>
  );
};
