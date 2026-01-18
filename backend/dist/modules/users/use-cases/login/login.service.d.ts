import { ILoginRequest, ILoginResponse } from './login.interface';
export declare class LoginService {
    private userRepository;
    constructor();
    execute({ email, password }: ILoginRequest): Promise<ILoginResponse>;
}
//# sourceMappingURL=login.service.d.ts.map