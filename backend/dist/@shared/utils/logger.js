"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const error_formatter_1 = require("./error-formatter");
function formatLog(entry) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
        return JSON.stringify(entry);
    }
    const level = entry.level.toUpperCase().padEnd(5);
    const timestamp = entry.timestamp;
    const message = entry.message;
    const extras = Object.keys(entry)
        .filter((key) => !['timestamp', 'level', 'message'].includes(key))
        .map((key) => `${key}=${JSON.stringify(entry[key])}`)
        .join(' ');
    return `[${level}] ${timestamp} - ${message}${extras ? ` ${extras}` : ''}`;
}
exports.logger = {
    info: (message, ...args) => {
        const entry = {
            timestamp: new Date().toISOString(),
            level: 'info',
            message,
        };
        if (args.length > 0) {
            args.forEach((arg, index) => {
                if (typeof arg === 'object' && arg !== null) {
                    Object.assign(entry, arg);
                }
                else {
                    entry[`arg${index}`] = arg;
                }
            });
        }
        console.log(formatLog(entry));
    },
    error: (message, error, ...args) => {
        if (error &&
            typeof error === 'object' &&
            'level' in error &&
            'errorId' in error) {
            console.error(formatLog(error));
            return;
        }
        if (error instanceof Error) {
            const formatted = (0, error_formatter_1.formatErrorForLog)(error);
            if (message &&
                message !== '[AppError Handler]' &&
                message !== '[Unexpected Error]') {
                formatted.message = `${message}: ${formatted.message}`;
            }
            console.error(formatLog(formatted));
            return;
        }
        const entry = {
            timestamp: new Date().toISOString(),
            level: 'error',
            message,
        };
        if (error) {
            entry.error = error;
        }
        if (args.length > 0) {
            args.forEach((arg, index) => {
                if (typeof arg === 'object' && arg !== null) {
                    Object.assign(entry, arg);
                }
                else {
                    entry[`arg${index}`] = arg;
                }
            });
        }
        console.error(formatLog(entry));
    },
    warn: (message, ...args) => {
        const entry = {
            timestamp: new Date().toISOString(),
            level: 'warn',
            message,
        };
        if (args.length > 0) {
            args.forEach((arg, index) => {
                if (typeof arg === 'object' && arg !== null) {
                    Object.assign(entry, arg);
                }
                else {
                    entry[`arg${index}`] = arg;
                }
            });
        }
        console.warn(formatLog(entry));
    },
    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            const entry = {
                timestamp: new Date().toISOString(),
                level: 'debug',
                message,
            };
            if (args.length > 0) {
                args.forEach((arg, index) => {
                    if (typeof arg === 'object' && arg !== null) {
                        Object.assign(entry, arg);
                    }
                    else {
                        entry[`arg${index}`] = arg;
                    }
                });
            }
            console.log(formatLog(entry));
        }
    },
};
//# sourceMappingURL=logger.js.map