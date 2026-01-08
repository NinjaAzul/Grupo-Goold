import { IRoom } from '@modules/rooms/model/room.interface';

export interface ICreateRoomRequest {
  name: string;
  startTime: string;
  endTime: string;
  timeBlock: number;
}

export interface ICreateRoomResponse {
  room: IRoom;
}
