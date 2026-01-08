import { IState } from '../../model/state.interface';
export declare class SyncStatesRepository {
    bulkCreateStates(states: Array<{
        id: number;
        name: string;
        uf: string;
    }>): Promise<number>;
    bulkCreateCities(cities: Array<{
        id: number;
        name: string;
        stateId: number;
    }>): Promise<number>;
    getAllStates(): Promise<IState[]>;
}
//# sourceMappingURL=sync.repository.d.ts.map