import { ICreateUserResponse } from './create.interface';
import { CreateUserDto } from './create.dto';
export declare class CreateUserService {
    private userRepository;
    private cityRepository;
    constructor();
    private hashPassword;
    private formatUserPermissions;
    execute(request: CreateUserDto): Promise<ICreateUserResponse>;
}
//# sourceMappingURL=create.service.d.ts.map