export const msToTime = (timeStamp: number) => {
  function pad(number: number) {
    return ("00" + number).slice(-2);
  }

  const ms = timeStamp % 1000;
  timeStamp = (timeStamp - ms) / 1000;
  const secs = timeStamp % 60;
  timeStamp = (timeStamp - secs) / 60;
  const minutes = timeStamp % 60;
  const hours = (timeStamp - minutes) / 60;

  return pad(hours) + ":" + pad(minutes);
};

export const hoursToMs = (hours: number) => {
  return 1000 * 60 * 60 * hours;
};

export const timeFrameInPercent = (timeframe: number, dailyWork: number): string => {
  return Math.round((timeframe / hoursToMs(dailyWork)) * 100) + "%";
};
