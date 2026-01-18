import { StateModel } from '../model/state.model';
import { CityModel } from '@modules/cities/model/city.model';
import { IState } from '../model/state.interface';

export class StateRepository {
  /**
   * Lista todos os estados
   */
  async findAll(): Promise<IState[]> {
    const states = await StateModel.findAll({
      order: [['uf', 'ASC']],
    });

    return states.map((state) => state.toJSON() as IState);
  }

  /**
   * Sincroniza estados em lote
   */
  async bulkCreateStates(
    states: Array<{
      id: number;
      name: string;
      uf: string;
    }>
  ): Promise<number> {
    const created = await StateModel.bulkCreate(states, {
      updateOnDuplicate: ['name', 'uf', 'updatedAt'],
    });

    return created.length;
  }

  /**
   * Sincroniza cidades em lote
   */
  async bulkCreateCities(
    cities: Array<{ id: number; name: string; stateId: number }>
  ): Promise<number> {
    const created = await CityModel.bulkCreate(cities, {
      updateOnDuplicate: ['name', 'stateId', 'updatedAt'],
    });

    return created.length;
  }

  /**
   * Retorna todos os estados (para sincronização)
   */
  async getAllStates(): Promise<IState[]> {
    const states = await StateModel.findAll({
      order: [['uf', 'ASC']],
    });

    return states.map((state) => state.toJSON() as IState);
  }
}

