import { StateModel } from '../../model/state.model';
import { IState } from '../../model/state.interface';

export class ListStatesRepository {
  async findAll(): Promise<IState[]> {
    const states = await StateModel.findAll({
      order: [['uf', 'ASC']],
    });

    return states.map((state) => state.toJSON() as IState);
  }
}
