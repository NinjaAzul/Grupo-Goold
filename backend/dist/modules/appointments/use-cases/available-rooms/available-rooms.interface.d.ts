import { IRoom } from '@modules/rooms/model/room.interface';
export interface IAvailableRoomsRequest {
    date: string;
    time: string;
}
export interface IAvailableRoomsResponse {
    rooms: IRoom[];
}
//# sourceMappingURL=available-rooms.interface.d.ts.map