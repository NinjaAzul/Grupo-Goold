import { AvailableSlotsRepository } from './available-slots.repository';
import {
  IAvailableSlotsRequest,
  IAvailableSlotsResponse,
} from './available-slots.interface';

export class AvailableSlotsService {
  private repository: AvailableSlotsRepository;

  constructor() {
    this.repository = new AvailableSlotsRepository();
  }

  async execute(
    request: IAvailableSlotsRequest
  ): Promise<IAvailableSlotsResponse> {
    // Validar que a data não é no passado
    const requestDate = new Date(request.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestDate < today) {
      return { slots: [] };
    }

    const slots = await this.repository.getAvailableSlots(request);

    return { slots };
  }
}

