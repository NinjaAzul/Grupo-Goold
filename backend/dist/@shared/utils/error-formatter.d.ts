export interface ErrorLogContext {
    path?: string;
    method?: string;
    errorId?: string;
    statusCode?: number;
}
export interface FormattedErrorLog {
    timestamp: string;
    level: 'error' | 'warn' | 'info';
    message: string;
    errorId?: string;
    statusCode?: number;
    path?: string;
    method?: string;
    stack?: string;
    [key: string]: unknown;
}
export declare function generateErrorId(): string;
export declare function filterStack(stack: string | undefined): string | undefined;
export declare function formatErrorForLog(error: Error, context?: ErrorLogContext): FormattedErrorLog;
export declare function formatErrorForResponse(error: Error & {
    statusCode?: number;
    name?: string;
}, errorId: string, isProduction: boolean): {
    error: {
        message: string;
        statusCode: number;
        name: string;
        errorId?: string;
    };
};
//# sourceMappingURL=error-formatter.d.ts.map