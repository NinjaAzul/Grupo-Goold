export interface ICity {
  id: number; // IBGE code
  name: string;
  stateId: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
