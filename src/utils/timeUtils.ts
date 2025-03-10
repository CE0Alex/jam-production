/**
 * Rounds a time value to the nearest hour
 * @param minutes Time in minutes
 * @returns Time rounded to nearest hour (in minutes)
 */
export function roundToNearestHour(minutes: number): number {
  return Math.round(minutes / 60) * 60;
}

/**
 * Formats a time value in minutes to a human-readable format (hours and minutes)
 * @param minutes Time in minutes
 * @returns Formatted time string (e.g., "2 hours 30 minutes" or "30 minutes")
 */
export function formatTimeDisplay(minutes: number): string {
  const hours = minutes / 60;
  const formattedHours = hours.toFixed(1);

  return `${formattedHours} hour${hours !== 1 ? "s" : ""}`;
}

/**
 * Validates if a time value is in 30-minute increments
 * @param minutes Time in minutes
 * @returns Boolean indicating if time is valid (in 30-minute increments)
 */
export function isValidTimeIncrement(minutes: number): boolean {
  return minutes % 30 === 0;
}
