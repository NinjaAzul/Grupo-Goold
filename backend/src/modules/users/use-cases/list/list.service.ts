import { ListUsersRepository } from './list.repository';
import { IListUsersRequest, IListUsersResponse } from './list.interface';

export class ListUsersService {
  private repository: ListUsersRepository;

  constructor() {
    this.repository = new ListUsersRepository();
  }

  async execute(filters: IListUsersRequest): Promise<IListUsersResponse> {
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
