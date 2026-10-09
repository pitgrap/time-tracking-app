/**
 *  Show notification for 3 seconds, then hide again
 * @param callback
 */
export const showNotification = (callback: (state: boolean) => void) => {
  callback(true);
  setTimeout(() => {
    callback(false);
  }, 3000);
  //
};
