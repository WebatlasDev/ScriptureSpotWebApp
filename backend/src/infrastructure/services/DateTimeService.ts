/**
 * Service for handling date and time operations
 * Provides consistent date/time functionality across the application
 */
export class DateTimeService {
  /**
   * Gets the current UTC date and time
   * @returns Current date and time in UTC
   */
  now(): Date {
    return new Date();
  }

  /**
   * Gets the current UTC date and time as ISO string
   * @returns Current date and time as ISO 8601 string
   */
  nowIsoString(): string {
    return new Date().toISOString();
  }

  /**
   * Gets the current date at midnight UTC
   * @returns Current date with time set to 00:00:00.000 UTC
   */
  today(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }

  /**
   * Adds days to a given date
   * @param date The base date
   * @param days Number of days to add (can be negative to subtract)
   * @returns New date with days added
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  /**
   * Adds months to a given date
   * @param date The base date
   * @param months Number of months to add (can be negative to subtract)
   * @returns New date with months added
   */
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setUTCMonth(result.getUTCMonth() + months);
    return result;
  }

  /**
   * Adds years to a given date
   * @param date The base date
   * @param years Number of years to add (can be negative to subtract)
   * @returns New date with years added
   */
  addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setUTCFullYear(result.getUTCFullYear() + years);
    return result;
  }

  /**
   * Formats a date as ISO date string (YYYY-MM-DD)
   * @param date The date to format
   * @returns ISO date string
   */
  formatIsoDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Parses an ISO date string to Date object
   * @param isoString ISO 8601 date string
   * @returns Parsed date object
   */
  parseIsoDate(isoString: string): Date {
    return new Date(isoString);
  }

  /**
   * Checks if a date is in the past
   * @param date The date to check
   * @returns True if the date is before now
   */
  isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Checks if a date is in the future
   * @param date The date to check
   * @returns True if the date is after now
   */
  isFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Gets the difference in days between two dates
   * @param date1 The first date
   * @param date2 The second date
   * @returns Number of days difference (positive if date2 is after date1)
   */
  diffInDays(date1: Date, date2: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / msPerDay);
  }

  /**
   * Sets time to midnight UTC for a given date
   * @param date The date to modify
   * @returns New date with time set to 00:00:00.000 UTC
   */
  startOfDay(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  /**
   * Sets time to 23:59:59.999 UTC for a given date
   * @param date The date to modify
   * @returns New date with time set to 23:59:59.999 UTC
   */
  endOfDay(date: Date): Date {
    return new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    ));
  }
}

// Singleton instance
export const dateTimeService = new DateTimeService();
