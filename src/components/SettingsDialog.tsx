import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/AppContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useTrackingContext } from "../contexts/TrackingContext";
import { deleteAllTrackings } from "../utils/TrackingStorage";
import { showNotification } from "../utils/UI";
import { availableLanguages } from "../utils/Translations";
import { DEFAULT_SETTINGS } from "../models/Settings";
import close from "../assets/close.svg";
import success from "../assets/success.svg";
import "./SettingsDialog.css";
import TimePicker from "react-time-picker";
import { transformTimeToDate } from "../utils/Time";
import "react-time-picker/dist/TimePicker.css";

export const SettingsDialog: React.FC = () => {
  const { showSettings, closeSettings } = useAppContext();
  const { settings, updateSettings } = useSettingsContext();
  const { resetToday: resetTrackingToday, setCustomStart } = useTrackingContext();
  const [customStartTime, setCustomStartTime] = useState(new Date());

  const [deleteActionShow, setDeleteActionShow] = useState(false);
  const [updateDailyWorkShow, setUpdateDailyWorkShow] = useState(false);
  const [updatePauseShow, setUpdatePauseShow] = useState(false);
  const [updateLanguageShow, setUpdateLanguageShow] = useState(false);
  const [resetActionShow, setResetActionShow] = useState(false);
  const [customStartTimeShow, setCustomStartTimeShow] = useState(false);
  const [workingDays, setWorkingDays] = useState<Set<number>>(
    new Set(settings?.workingDays ?? DEFAULT_SETTINGS.workingDays),
  );

  const { t, i18n } = useTranslation();
  const languageNames = new Intl.DisplayNames(i18n.language, { type: "language" });
  const weekdays = [t("sunday"), t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday"), t("saturday")];

  const changeDailyWork = (event: React.FormEvent<HTMLInputElement>) => {
    const newDailyWork = parseInt(event.currentTarget.value);
    setUpdateDailyWorkShow(false);
    if (newDailyWork && settings && updateSettings) {
      updateSettings({ ...settings, dailyWork: newDailyWork });
      showNotification(setUpdateDailyWorkShow);
    }
  };

  const changeDailyPause = (event: React.FormEvent<HTMLInputElement>) => {
    const newDailyPause = parseInt(event.currentTarget.value);
    setUpdatePauseShow(false);
    if (newDailyPause >= 0 && settings && updateSettings) {
      updateSettings({ ...settings, dailyPause: newDailyPause });
      showNotification(setUpdatePauseShow);
    }
  };

  const clearHistory = () => {
    deleteAllTrackings();
    showNotification(setDeleteActionShow);
  };

  const resetToday = () => {
    resetTrackingToday();
    showNotification(setResetActionShow);
  };

  const confirmCustomStartTime = (customStartTime: number) => {
    setCustomStart(customStartTime);
    showNotification(setCustomStartTimeShow);
  };

  const changeLanguage = (event: React.FormEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.currentTarget.value);
    showNotification(setUpdateLanguageShow);
  };

  const handleWorkingDayChange = (day: number) => {
    const updated = new Set(workingDays);
    if (workingDays.has(day)) {
      updated.delete(day);
    } else {
      updated.add(day);
    }
    setWorkingDays(updated);
    if (settings && updateSettings) {
      updateSettings({ ...settings, workingDays: Array.from(updated).sort() });
    }
  };

  const dialogRef = useRef<HTMLDialogElement>(null);

  // showModal() gives us native modal semantics for free: focus trapping,
  // ::backdrop, inert background content, and ESC-to-close (which fires a
  // native "close" event we sync back into closeSettings() below).
  // showSettings is a dependency even though it isn't read in the effect
  // body: the <dialog> only exists in the DOM while showSettings is true
  // (see the conditional render below), so this must re-run whenever that
  // flips in order to pick up the freshly-mounted dialog node via the ref.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const handleClose = () => closeSettings?.();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [showSettings, closeSettings]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      closeSettings?.();
    }
  };

  return (
    <>
      {showSettings && (
        <dialog ref={dialogRef} className="app-settings" onClick={handleBackdropClick}>
          <button type="button" className="app__close" onClick={closeSettings}>
            <img src={close} alt={t("close")} title={t("close")} />
          </button>
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
            <label className="action__label">{t("workingDays")}</label>
            <br />
            <div className="action__weekdays">
              {(i18n.language === "de"
                ? [1, 2, 3, 4, 5, 6, 0] // Monday to Sunday for German
                : [0, 1, 2, 3, 4, 5, 6]
              ) // Sunday to Saturday for others
                .map((idx) => (
                  <React.Fragment key={idx}>
                    <label className="weekday-checkbox">
                      <input
                        type="checkbox"
                        checked={workingDays.has(idx)}
                        onChange={() => handleWorkingDayChange(idx)}
                      />
                      {weekdays[idx]}
                    </label>
                    <br />
                  </React.Fragment>
                ))}
            </div>
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
                confirmCustomStartTime(customStartTime.getTime());
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
      )}
    </>
  );
};
