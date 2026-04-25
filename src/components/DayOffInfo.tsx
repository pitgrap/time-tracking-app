import React from "react";
import { useTranslation } from "react-i18next";

export const DayOffInfo: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="day-off-info">
      <h2>{t("dayOffTitle")}</h2>
      <p>{t("dayOffMessage")}</p>
    </div>
  );
};
