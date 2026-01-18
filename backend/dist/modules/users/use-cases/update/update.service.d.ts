import { IUpdateUserRequest, IUpdateUserResponse } from './update.interface';
export declare class UpdateUserService {
    private userRepository;
    private cityRepository;
    private roleRepository;
    constructor();
    private hashPassword;
    execute(request: IUpdateUserRequest): Promise<IUpdateUserResponse>;
}
//# sourceMappingURL=update.service.d.ts.map