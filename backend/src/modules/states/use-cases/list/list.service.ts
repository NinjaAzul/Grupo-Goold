import { ListStatesRepository } from './list.repository';
import { IListStatesResponse } from './list.interface';

export class ListStatesService {
  private listStatesRepository: ListStatesRepository;

  constructor() {
    this.listStatesRepository = new ListStatesRepository();
  }

  async execute(): Promise<IListStatesResponse> {
    const states = await this.listStatesRepository.findAll();

    return {
      states,
      total: states.length,
    };
  }
}
