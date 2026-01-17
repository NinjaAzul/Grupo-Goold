import { ILoginRequest, ILoginResponse } from './login.interface';
export declare class LoginService {
    private loginRepository;
    constructor();
    execute({ email, password }: ILoginRequest): Promise<ILoginResponse>;
}
//# sourceMappingURL=login.service.d.ts.map