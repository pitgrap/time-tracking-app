export interface DailyTracking {
  /**
   * A real Date when freshly constructed, but a plain ISO-ish string once
   * it's been round-tripped through JSON.stringify/localStorage (JSON has
   * no Date type). Always wrap reads with `new Date(tracking.day)` before
   * calling any Date method on it.
   */
  day: Date | string;
  start: number;
  end: number;
  duration?: number;
}
