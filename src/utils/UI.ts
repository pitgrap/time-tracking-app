import { useEffect } from "react";

/**
 *
 * @param open
 * @param callback
 */
export const useCloseOnEsc = (open = false, callback?: () => void) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (open && callback) {
          callback();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, callback]);
};

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
