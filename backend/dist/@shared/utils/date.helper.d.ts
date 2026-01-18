/**
 * Helper for working with dates in UTC/ISO format
 * Ensures consistency across the entire system
 */
export declare class DateHelper {
    /**
     * Formats an ISO (UTC) date to Brazilian format
     * @param isoDate - Date in ISO string format (UTC)
     * @returns Formatted string: "dd/MM/yyyy às HH:mm"
     */
    static formatAppointmentDate(isoDate: string | Date): string;
    /**
     * Creates a UTC date from date and time components
     * @param year - Year
     * @param month - Month (1-12)
     * @param day - Day
     * @param hours - Hour (0-23)
     * @param minutes - Minutes (0-59)
     * @returns Date object in UTC
     */
    static createUTCDate(year: number, month: number, day: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): Date;
    /**
     * Creates a UTC date from a date string (YYYY-MM-DD) and time string (HH:mm)
     * @param dateString - Date in YYYY-MM-DD format
     * @param timeString - Time in HH:mm format
     * @returns Date object in UTC
     */
    static createUTCFromDateAndTime(dateString: string, timeString: string): Date;
    /**
     * Gets the start of the day in UTC
     * @param dateString - Date in YYYY-MM-DD format
     * @returns Date object representing 00:00:00 UTC of the day
     */
    static getStartOfDayUTC(dateString: string): Date;
    /**
     * Gets the end of the day in UTC
     * @param dateString - Date in YYYY-MM-DD format
     * @returns Date object representing 23:59:59.999 UTC of the day
     */
    static getEndOfDayUTC(dateString: string): Date;
    /**
     * Adds minutes to a UTC date
     * @param date - Date in UTC
     * @param minutes - Minutes to add
     * @returns New Date object in UTC
     */
    static addMinutesUTC(date: Date, minutes: number): Date;
    /**
     * Adds hours to a UTC date
     * @param date - Date in UTC
     * @param hours - Hours to add
     * @returns New Date object in UTC
     */
    static addHoursUTC(date: Date, hours: number): Date;
    /**
     * Formats a UTC date to ISO string
     * @param date - Date object
     * @returns ISO string (UTC)
     */
    static toISOString(date: Date): string;
    /**
     * Converts an ISO string to Date object
     * @param isoString - ISO string
     * @returns Date object
     */
    static fromISOString(isoString: string): Date;
    /**
     * Extracts only the date (without time) from an ISO date
     * @param isoDate - Date in ISO string format (UTC)
     * @returns String in YYYY-MM-DD format
     */
    static extractDateOnly(isoDate: string | Date): string;
    /**
     * Extracts only the time (without date) from an ISO date
     * @param isoDate - Date in ISO string format (UTC)
     * @returns String in HH:mm format
     */
    static extractTimeOnly(isoDate: string | Date): string;
}
//# sourceMappingURL=date.helper.d.ts.map