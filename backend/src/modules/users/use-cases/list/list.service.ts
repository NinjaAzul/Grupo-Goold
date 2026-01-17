import { ListUsersRepository } from './list.repository';
import { IListUsersResponse } from './list.interface';
import { ListUsersQueryDto } from './list-query.dto';

export class ListUsersService {
  private repository: ListUsersRepository;

  constructor() {
    this.repository = new ListUsersRepository();
  }

  async execute(filters: ListUsersQueryDto): Promise<IListUsersResponse> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { users, total } = await this.repository.findAll(filters);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
