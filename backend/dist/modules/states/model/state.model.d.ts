import { Model } from 'sequelize';
import { IState } from './state.interface';
type StateCreationAttributes = Omit<IState, 'createdAt' | 'updatedAt'>;
export declare class StateModel extends Model<IState, StateCreationAttributes> implements IState {
    id: number;
    name: string;
    uf: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export {};
//# sourceMappingURL=state.model.d.ts.map