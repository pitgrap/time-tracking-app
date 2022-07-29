import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../i18n/en.json";
import de from "../i18n/de.json";

const resources = {
  en,
  de,
};

export const availableLanguages = Object.keys(resources);

export const initTranslations = () => {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      defaultNS: "common",
      fallbackLng: "en",
    })
    .then(() => {
      document.documentElement.lang = i18next.language;
    });
};
