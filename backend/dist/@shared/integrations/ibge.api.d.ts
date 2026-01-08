interface IBGEState {
    id: number;
    sigla: string;
    nome: string;
    regiao: {
        id: number;
        sigla: string;
        nome: string;
    };
}
interface IBGECity {
    id: number;
    nome: string;
    microrregiao: {
        id: number;
        nome: string;
        mesorregiao: {
            id: number;
            nome: string;
            UF: {
                id: number;
                sigla: string;
                nome: string;
            };
        };
    };
}
declare class IBGEApi {
    private client;
    private readonly baseURL;
    constructor();
    getStates(): Promise<IBGEState[]>;
    getCitiesByState(uf: string): Promise<IBGECity[]>;
}
export declare const ibgeApi: IBGEApi;
export type { IBGEState, IBGECity };
//# sourceMappingURL=ibge.api.d.ts.map