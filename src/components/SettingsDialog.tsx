import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { deleteAllTrackings, resetTodayLocalStorage, useCustomStartDate } from "../utils/TrackingStorage";
import { showNotification, useCloseOnEsc } from "../utils/UI";
import { availableLanguages } from "../utils/Translations";
import { Settings } from "../models/Settings";
import close from "../assets/close.svg";
import success from "../assets/success.svg";
import "./SettingsDialog.css";
import TimePicker from "react-time-picker";
import { transformTimeToDate } from "../utils/Time";
import "react-time-picker/dist/TimePicker.css";

export const SettingsDialog: React.FC = () => {
  const { showSettings, toggleSettings } = useAppContext();
  const { settings, updateSettings } = useSettingsContext();
  const [customStartTime, setCustomStartTime] = useState(new Date());

  const [deleteActionShow, setDeleteActionShow] = useState(false);
  const [updateDailyWorkShow, setUpdateDailyWorkShow] = useState(false);
  const [updatePauseShow, setUpdatePauseShow] = useState(false);
  const [updateLanguageShow, setUpdateLanguageShow] = useState(false);
  const [resetActionShow, setResetActionShow] = useState(false);
  const [customStartTimeShow, setCustomStartTimeShow] = useState(false);

  const changeDailyWork = (event: React.FormEvent<HTMLInputElement>) => {
    const newDailyWork = parseInt(event.currentTarget.value);
    setUpdateDailyWorkShow(false);
    if (newDailyWork && settings && updateSettings) {
      const newSettings: Settings = settings;
      newSettings.dailyWork = newDailyWork;
      updateSettings(newSettings);
      showNotification(setUpdateDailyWorkShow);
    }
  };

  const changeDailyPause = (event: React.FormEvent<HTMLInputElement>) => {
    const newDailyPause = parseInt(event.currentTarget.value);
    setUpdatePauseShow(false);
    if (newDailyPause >= 0 && settings && updateSettings) {
      const newSettings = settings;
      newSettings.dailyPause = newDailyPause;
      updateSettings(newSettings);
      showNotification(setUpdatePauseShow);
    }
  };

  const clearHistory = () => {
    deleteAllTrackings();
    showNotification(setDeleteActionShow);
  };

  const resetToday = () => {
    resetTodayLocalStorage();
    showNotification(setResetActionShow);
  };

  const useCustomStartTime = (customStartTime: number) => {
    useCustomStartDate(customStartTime);
    showNotification(setCustomStartTimeShow);
  };

  const { t, i18n } = useTranslation();
  const languageNames = new Intl.DisplayNames(i18n.language, { type: "language" });
  const changeLanguage = (event: React.FormEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.currentTarget.value);
    showNotification(setUpdateLanguageShow);
  };

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
                onChange={changeDailyWork}
              />
              <span className="action__result">
                {updateDailyWorkShow && (
                  <span className="action__success">
                    <img src={success} alt={t("success")} />
                  </span>
                )}
              </span>
            </div>

            <div className="action">
              <label className="action__label" htmlFor="dailyPause">
                {t("pauseMinutes")}
              </label>
              <br />
              <input
                id="dailyPause"
                className="action__input"
                type="number"
                defaultValue={settings?.dailyPause}
                onChange={changeDailyPause}
              />
              <span className="action__result">
                {updatePauseShow && (
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
              <select
                id="language"
                className="action__select"
                defaultValue={i18n.language.split("-")[0]}
                onChange={changeLanguage}
              >
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
              <label className="action__label">{t("timeTracking")}</label>
              <br />
              <button className="action__button" onClick={resetToday}>
                {t("resetToday")}
              </button>
              <span className="action__result">
                {resetActionShow && (
                  <span className="action__success">
                    <img src={success} alt={t("success")} />
                  </span>
                )}
              </span>
            </div>

            <hr className="action__splitter" />

            <div className="action">
              <label className="action__label">{t("setStartTime")}</label>
              <br />
              <TimePicker
                onChange={(time) => time && setCustomStartTime(transformTimeToDate(time.toString(), customStartTime))}
                value={customStartTime}
                disableClock
                clearIcon={null}
              />
              <br />
              <button
                className="action__button"
                onClick={() => {
                  useCustomStartTime(customStartTime.getTime());
                }}
              >
                {t("confirmStartTime")}
              </button>
              <span className="action__result">
                {customStartTimeShow && (
                  <span className="action__success">
                    <img src={success} alt={t("success")} />
                  </span>
                )}
              </span>
            </div>

            <hr className="action__splitter" />

            <div className="action">
              <label className="action__label">{t("history")}</label>
              <br />
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
