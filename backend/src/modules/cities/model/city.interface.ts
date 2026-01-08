export interface ICity {
  id: number;
  name: string;
  stateId: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
