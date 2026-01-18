export interface ICreateLogParams {
    userId?: number | null;
    activityType: string;
    module: string;
    description?: string | null;
}
export declare class LoggerService {
    static createLog(params: ICreateLogParams): Promise<void>;
    static log(activityType: string, module: string, userId?: number | null, description?: string | null): Promise<void>;
}
//# sourceMappingURL=logger.service.d.ts.map