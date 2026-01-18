"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorId = generateErrorId;
exports.filterStack = filterStack;
exports.formatErrorForLog = formatErrorForLog;
exports.formatErrorForResponse = formatErrorForResponse;
const crypto_1 = require("crypto");
function generateErrorId() {
    return (0, crypto_1.randomUUID)();
}
function filterStack(stack) {
    if (!stack)
        return undefined;
    const isProduction = process.env.NODE_ENV === 'production';
    const lines = stack.split('\n');
    if (isProduction) {
        return undefined;
    }
    const filtered = lines.filter((line) => {
        const trimmed = line.trim();
        return (trimmed.startsWith('at ') &&
            !trimmed.includes('node_modules') &&
            !trimmed.includes('internal/'));
    });
    if (filtered.length === 0) {
        return undefined;
    }
    return filtered.slice(0, 10).join('\n');
}
function formatErrorForLog(error, context) {
    const isProduction = process.env.NODE_ENV === 'production';
    const errorId = context?.errorId || generateErrorId();
    const formatted = {
        timestamp: new Date().toISOString(),
        level: 'error',
        message: error.message || 'Unknown error',
        errorId,
    };
    if (context?.statusCode) {
        formatted.statusCode = context.statusCode;
    }
    if (context?.path) {
        formatted.path = context.path;
    }
    if (context?.method) {
        formatted.method = context.method;
    }
    if (!isProduction && error.stack) {
        formatted.stack = filterStack(error.stack);
    }
    return formatted;
}
function formatErrorForResponse(error, errorId, isProduction) {
    const statusCode = error.statusCode || 500;
    const name = error.name || 'Error';
    const response = {
        error: {
            message: isProduction
                ? 'Erro interno do servidor'
                : error.message || 'Erro interno do servidor',
            statusCode,
            name,
        },
    };
    if (!isProduction) {
        response.error.errorId = errorId;
    }
    return response;
}
//# sourceMappingURL=error-formatter.js.map