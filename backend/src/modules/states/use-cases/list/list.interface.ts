import { IState } from '../../model/state.interface';

export interface IListStatesResponse {
  states: IState[];
  total: number;
}
