import { IRoom } from '../model/room.interface';
import { CreateRoomDto } from '../use-cases/create/create.dto';
import { UpdateRoomDto } from '../use-cases/update/update.dto';
export declare class RoomRepository {
    create(data: CreateRoomDto): Promise<IRoom | null>;
    findAll(): Promise<IRoom[]>;
    findById(roomId: number): Promise<IRoom | null>;
    update(roomId: number, data: UpdateRoomDto): Promise<IRoom | null>;
    delete(roomId: number): Promise<boolean>;
    countAppointmentsByRoomName(roomName: string): Promise<number>;
}
//# sourceMappingURL=room.repository.d.ts.map