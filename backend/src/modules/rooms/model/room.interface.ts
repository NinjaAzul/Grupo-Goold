export interface IRoom {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  timeBlock: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
