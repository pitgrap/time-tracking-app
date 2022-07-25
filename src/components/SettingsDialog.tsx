import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { Settings } from "../models/Settings";
import { deleteAllTrackings } from "../utils/LocalStorage";
import { showNotification, useCloseOnEsc } from "../utils/UI";
import { availableLanguages } from "../utils/Translations";
import close from "../assets/close.svg";
import success from "../assets/success.svg";
import "./SettingsDialog.css";

export const SettingsDialog: React.FC = () => {
  const { showSettings, toggleSettings } = useAppContext();
  const { settings, updateSettings } = useSettingsContext();

  const [deleteActionShow, setDeleteActionShow] = useState(false);
  const [updateActionShow, setUpdateActionShow] = useState(false);
  const [updateLanguageShow, setUpdateLanguageShow] = useState(false);

  const changeSettings = (event: React.FormEvent<HTMLInputElement>) => {
    const newDailyWork = parseInt(event.currentTarget.value);
    setUpdateActionShow(false);
    if (newDailyWork && updateSettings) {
      const newSettings: Settings = {
        dailyWork: newDailyWork,
      };
      updateSettings(newSettings);
      showNotification(setUpdateActionShow);
    }
  };

  const clearHistory = () => {
    deleteAllTrackings();
    showNotification(setDeleteActionShow);
  };

  const { t, i18n } = useTranslation();
  const languageNames = new Intl.DisplayNames(i18n.language, { type: "language" });
  const changeLanguage = (event: React.FormEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.currentTarget.value);
    showNotification(setUpdateLanguageShow);
  };

  // ideas:
  // - set start of the day manually or reset today

  // close on esc
  useCloseOnEsc(showSettings, toggleSettings);

  return (
    <>
      {showSettings && (
        <>
          <div className="app__background" onClick={toggleSettings}></div>
          <dialog className="app-settings">
            <span className="app__close" onClick={toggleSettings}>
              <img src={close} alt={t("close")} title={t("close")} />
            </span>
            <h2>{t("settings")}</h2>

            <div className="action">
              <label className="action__label" htmlFor="dailyWork">
                {t("workHours")}
              </label>
              <br />
              <input
                id="dailyWork"
                className="action__input"
                type="number"
                defaultValue={settings?.dailyWork}
                onChange={changeSettings}
              />
              <span className="action__result">
                {updateActionShow && (
                  <span className="action__success">
                    <img src={success} alt={t("success")} />
                  </span>
                )}
              </span>
            </div>

            <hr className="action__splitter" />

            <div className="action">
              <label className="action__label" htmlFor="language">
                {t("language")}
              </label>
              <br />
              <select id="language" className="action__select" defaultValue={i18n.language} onChange={changeLanguage}>
                {availableLanguages.map((language, index) => (
                  <option key={index} value={language}>
                    {languageNames.of(language)}
                  </option>
                ))}
              </select>
              <span className="action__result">
                {updateLanguageShow && (
                  <span className="action__success">
                    <img src={success} alt={t("success")} />
                  </span>
                )}
              </span>
            </div>

            <hr className="action__splitter" />

            <div className="action">
              <button className="action__button" onClick={clearHistory}>
                {t("deleteHistory")}
              </button>
              <span className="action__result">
                {deleteActionShow && (
                  <span className="action__success">
                    <img src={success} alt={t("success")} />
                  </span>
                )}
              </span>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};
