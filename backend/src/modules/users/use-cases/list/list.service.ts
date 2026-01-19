import { UserRepository } from '../../repositories/user.repository';
import { IListUsersResponse } from './list.interface';
import { ListUsersQueryDto } from './list-query.dto';
import { DateHelper } from '@shared/utils/date.helper';

export class ListUsersService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async execute(filters: ListUsersQueryDto): Promise<IListUsersResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { users, total } = await this.repository.findAll(filters);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: DateHelper.normalizeDatesInObject(users),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
