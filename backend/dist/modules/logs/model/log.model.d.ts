import { Model } from 'sequelize';
import { ILog } from './log.interface';
export declare class LogModel extends Model<ILog> implements ILog {
    id: number;
    userId: number | null;
    activityType: string;
    module: string;
    description: string | null;
    readonly createdAt: Date;
}
//# sourceMappingURL=log.model.d.ts.map