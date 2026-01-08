import { ICreateUserResponse } from './create.interface';
import { CreateUserDto } from './create.dto';
export declare class CreateUserService {
    private createUserRepository;
    constructor();
    execute(request: CreateUserDto): Promise<ICreateUserResponse>;
}
//# sourceMappingURL=create.service.d.ts.map