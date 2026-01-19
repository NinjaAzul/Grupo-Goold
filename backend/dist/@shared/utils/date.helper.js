"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const date_fns_1 = require("date-fns");
class DateHelper {
    /**
     * Formats an ISO (UTC) date to Brazilian format
     * @param isoDate - Date in ISO string format (UTC)
     * @returns Formatted string: "dd/MM/yyyy às HH:mm"
     */
    static formatAppointmentDate(isoDate) {
        const date = typeof isoDate === 'string' ? (0, date_fns_1.parseISO)(isoDate) : isoDate;
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
    static createUTCDate(year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
        return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds));
    }
    /**
     * Gets the start of the day in UTC
     * @param dateString - Date in YYYY-MM-DD format
     * @returns Date object representing 00:00:00 UTC of the day
     */
    static getStartOfDayUTC(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return this.createUTCDate(year, month, day, 0, 0, 0, 0);
    }
    /**
     * Gets the end of the day in UTC
     * @param dateString - Date in YYYY-MM-DD format
     * @returns Date object representing 23:59:59.999 UTC of the day
     */
    static getEndOfDayUTC(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return this.createUTCDate(year, month, day, 23, 59, 59, 999);
    }
    /**
     * Adds minutes to a UTC date
     * @param date - Date in UTC
     * @param minutes - Minutes to add
     * @returns New Date object in UTC
     */
    static addMinutesUTC(date, minutes) {
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
    static addHoursUTC(date, hours) {
        const newDate = new Date(date);
        newDate.setUTCHours(newDate.getUTCHours() + hours);
        return newDate;
    }
    /**
     * Converts an ISO string to Date object
     * @param isoString - ISO string
     * @returns Date object
     */
    static fromISOString(isoString) {
        return (0, date_fns_1.parseISO)(isoString);
    }
    /**
     * Extracts only the time (without date) from an ISO date
     * @param isoDate - Date in ISO string format (UTC)
     * @returns String in HH:mm format
     */
    static extractTimeOnly(isoDate) {
        const date = typeof isoDate === 'string' ? (0, date_fns_1.parseISO)(isoDate) : isoDate;
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    static normalizeToISOUTC(value) {
        if (value === null || value === undefined) {
            return value;
        }
        if (typeof value === 'string') {
            if (value.endsWith('Z')) {
                return value;
            }
            if (value.includes('+') ||
                (value.includes('-') && value.match(/-\d{2}:\d{2}$/))) {
                const date = (0, date_fns_1.parseISO)(value);
                return date.toISOString();
            }
            return value + 'Z';
        }
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }
    /**
     * Recursively normalizes all date fields in an object to ISO UTC strings
     * @param obj - Object to normalize
     * @returns Object with all dates normalized to ISO UTC strings
     */
    static normalizeDatesInObject(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (obj instanceof Date) {
            return obj.toISOString();
        }
        if (typeof obj === 'string') {
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
                return this.normalizeToISOUTC(obj);
            }
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.normalizeDatesInObject(item));
        }
        if (typeof obj === 'object') {
            const normalized = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (key === 'createdAt' ||
                        key === 'updatedAt' ||
                        key === 'appointmentDate' ||
                        key === 'deletedAt' ||
                        value instanceof Date) {
                        normalized[key] =
                            this.normalizeToISOUTC(value);
                    }
                    else {
                        normalized[key] =
                            this.normalizeDatesInObject(value);
                    }
                }
            }
            return normalized;
        }
        return obj;
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=date.helper.js.map