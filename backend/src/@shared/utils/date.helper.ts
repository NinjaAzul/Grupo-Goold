import { parseISO } from 'date-fns';

/**
 * Helper for working with dates in UTC/ISO format
 * Ensures consistency across the entire system
 */
export class DateHelper {
  /**
   * Formats an ISO (UTC) date to Brazilian format
   * @param isoDate - Date in ISO string format (UTC)
   * @returns Formatted string: "dd/MM/yyyy às HH:mm"
   */
  static formatAppointmentDate(isoDate: string | Date): string {
    const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  /**
   * Creates a UTC date from date and time components
   * @param year - Year
   * @param month - Month (1-12)
   * @param day - Day
   * @param hours - Hour (0-23)
   * @param minutes - Minutes (0-59)
   * @returns Date object in UTC
   */
  static createUTCDate(
    year: number,
    month: number,
    day: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0
  ): Date {
    return new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds)
    );
  }

  /**
   * Creates a UTC date from a date string (YYYY-MM-DD) and time string (HH:mm)
   * @param dateString - Date in YYYY-MM-DD format
   * @param timeString - Time in HH:mm format
   * @returns Date object in UTC
   */
  static createUTCFromDateAndTime(
    dateString: string,
    timeString: string
  ): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return this.createUTCDate(year, month, day, hours, minutes);
  }

  /**
   * Gets the start of the day in UTC
   * @param dateString - Date in YYYY-MM-DD format
   * @returns Date object representing 00:00:00 UTC of the day
   */
  static getStartOfDayUTC(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return this.createUTCDate(year, month, day, 0, 0, 0, 0);
  }

  /**
   * Gets the end of the day in UTC
   * @param dateString - Date in YYYY-MM-DD format
   * @returns Date object representing 23:59:59.999 UTC of the day
   */
  static getEndOfDayUTC(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return this.createUTCDate(year, month, day, 23, 59, 59, 999);
  }

  /**
   * Adds minutes to a UTC date
   * @param date - Date in UTC
   * @param minutes - Minutes to add
   * @returns New Date object in UTC
   */
  static addMinutesUTC(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setUTCMinutes(newDate.getUTCMinutes() + minutes);
    return newDate;
  }

  /**
   * Adds hours to a UTC date
   * @param date - Date in UTC
   * @param hours - Hours to add
   * @returns New Date object in UTC
   */
  static addHoursUTC(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setUTCHours(newDate.getUTCHours() + hours);
    return newDate;
  }

  /**
   * Formats a UTC date to ISO string
   * @param date - Date object
   * @returns ISO string (UTC)
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Converts an ISO string to Date object
   * @param isoString - ISO string
   * @returns Date object
   */
  static fromISOString(isoString: string): Date {
    return parseISO(isoString);
  }

  /**
   * Extracts only the date (without time) from an ISO date
   * @param isoDate - Date in ISO string format (UTC)
   * @returns String in YYYY-MM-DD format
   */
  static extractDateOnly(isoDate: string | Date): string {
    const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Extracts only the time (without date) from an ISO date
   * @param isoDate - Date in ISO string format (UTC)
   * @returns String in HH:mm format
   */
  static extractTimeOnly(isoDate: string | Date): string {
    const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
