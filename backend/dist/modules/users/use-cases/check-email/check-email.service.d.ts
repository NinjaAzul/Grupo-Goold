import { ICheckEmailRequest, ICheckEmailResponse } from './check-email.interface';
export declare class CheckEmailService {
    private userRepository;
    constructor();
    execute({ email }: ICheckEmailRequest): Promise<ICheckEmailResponse>;
}
//# sourceMappingURL=check-email.service.d.ts.map