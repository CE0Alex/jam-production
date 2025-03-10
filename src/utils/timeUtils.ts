/**
 * Rounds a time value to the nearest 30-minute increment
 * @param minutes Time in minutes
 * @returns Time rounded to nearest 30-minute increment
 */
export function roundToNearestThirtyMinutes(minutes: number): number {
  return Math.ceil(minutes / 30) * 30;
}

/**
 * Formats a time value in minutes to a human-readable format (hours and minutes)
 * @param minutes Time in minutes
 * @returns Formatted time string (e.g., "2 hours 30 minutes" or "30 minutes")
 */
export function formatTimeDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} minutes`;
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minutes`;
  }
}

/**
 * Validates if a time value is in 30-minute increments
 * @param minutes Time in minutes
 * @returns Boolean indicating if time is valid (in 30-minute increments)
 */
export function isValidTimeIncrement(minutes: number): boolean {
  return minutes % 30 === 0;
}
