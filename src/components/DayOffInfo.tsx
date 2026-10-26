import React from "react";
import { useTranslation } from "react-i18next";

// Takes no props and reads no context, so React.memo's prop comparison
// always bails out of re-rendering it - it only needs to render once per
// actual language change, not on every tick of MainContent's parent clock.
export const DayOffInfo: React.FC = React.memo(function DayOffInfo() {
  const { t } = useTranslation();
  return (
    <div className="day-off-info">
      <h2>{t("dayOffTitle")}</h2>
      <p>{t("dayOffMessage")}</p>
    </div>
  );
});
