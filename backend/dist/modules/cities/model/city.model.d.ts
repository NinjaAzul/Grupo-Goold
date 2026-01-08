import { Model } from 'sequelize';
import { ICity } from './city.interface';
type CityCreationAttributes = Omit<ICity, 'createdAt' | 'updatedAt'>;
export declare class CityModel extends Model<ICity, CityCreationAttributes> implements ICity {
    id: number;
    name: string;
    stateId: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export {};
//# sourceMappingURL=city.model.d.ts.map