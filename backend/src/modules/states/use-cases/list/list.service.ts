import { StateRepository } from '../../repositories/state.repository';
import { IListStatesResponse } from './list.interface';

export class ListStatesService {
  private stateRepository: StateRepository;

  constructor() {
    this.stateRepository = new StateRepository();
  }

  async execute(): Promise<IListStatesResponse> {
    const states = await this.stateRepository.findAll();

    return {
      states,
      total: states.length,
    };
  }
}
