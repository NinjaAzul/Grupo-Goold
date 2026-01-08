interface ViaCEPResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}
declare class ViaCEPApi {
    private client;
    private readonly baseURL;
    constructor();
    getAddressByCEP(cep: string): Promise<ViaCEPResponse>;
}
export declare const viaCepApi: ViaCEPApi;
export type { ViaCEPResponse };
//# sourceMappingURL=viacep.api.d.ts.map