export interface IState {
  id: number;
  name: string;
  uf: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
