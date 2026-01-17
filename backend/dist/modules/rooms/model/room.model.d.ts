import { Model } from 'sequelize';
import { IRoom } from './room.interface';
export declare class RoomModel extends Model<IRoom> implements IRoom {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    timeBlock: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=room.model.d.ts.map