import { IState } from '../model/state.interface';
export declare class StateRepository {
    /**
     * Lista todos os estados
     */
    findAll(): Promise<IState[]>;
    /**
     * Sincroniza estados em lote
     */
    bulkCreateStates(states: Array<{
        id: number;
        name: string;
        uf: string;
    }>): Promise<number>;
    /**
     * Sincroniza cidades em lote
     */
    bulkCreateCities(cities: Array<{
        id: number;
        name: string;
        stateId: number;
    }>): Promise<number>;
    /**
     * Retorna todos os estados (para sincronização)
     */
    getAllStates(): Promise<IState[]>;
}
//# sourceMappingURL=state.repository.d.ts.map