import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { Settings } from "../models/Settings";
import { deleteAllTrackings } from "../utils/LocalStorage";
import { showNotification, useCloseOnEsc } from "../utils/UI";
import close from "../assets/close.svg";
import success from "../assets/success.svg";
import "./SettingsDialog.css";

export const SettingsDialog: React.FC = () => {
  const { showSettings, toggleSettings } = useAppContext();
  const { settings, updateSettings } = useSettingsContext();

  const [deleteActionShow, setDeleteActionShow] = useState(false);
  const [updateActionShow, setUpdateActionShow] = useState(false);

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
              <img src={close} alt="Schliessen" />
            </span>
            <h2>Einstellungen</h2>
            <p className="action">
              <label className="action__label" htmlFor="dailyWork">
                Tägliche Arbeitszeit (in Stunden)
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
                    <img src={success} alt="Stundenzahl geändert" />
                  </span>
                )}
              </span>
            </p>

            <p className="action">
              <button className="action__button" onClick={clearHistory}>
                Verlauf löschen
              </button>
              <span className="action__result">
                {deleteActionShow && (
                  <span className="action__success">
                    <img src={success} alt="Verlauf erfolgreich gelöscht" />
                  </span>
                )}
              </span>
            </p>
          </dialog>
        </>
      )}
    </>
  );
};
