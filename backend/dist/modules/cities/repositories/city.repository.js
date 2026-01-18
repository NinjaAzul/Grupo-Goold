"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityRepository = void 0;
const city_model_1 = require("../model/city.model");
const state_model_1 = require("@modules/states/model/state.model");
const query_builder_1 = require("@shared/utils/query-builder");
class CityRepository {
    async findById(cityId) {
        const city = await city_model_1.CityModel.findByPk(cityId);
        return city ? city.toJSON() : null;
    }
    async findByIbgeCode(ibgeCode) {
        const city = await city_model_1.CityModel.findOne({
            where: { id: ibgeCode },
        });
        return city ? city.toJSON() : null;
    }
    async findAll(stateId, uf) {
        const queryBuilder = new query_builder_1.QueryBuilder();
        if (stateId) {
            queryBuilder.where({ stateId });
        }
        if (uf) {
            queryBuilder.include([
                {
                    model: state_model_1.StateModel,
                    as: 'state',
                    where: { uf },
                    required: true,
                },
            ]);
        }
        queryBuilder.order([['name', 'ASC']]);
        const cities = await city_model_1.CityModel.findAll(queryBuilder.build());
        return cities.map((city) => city.toJSON());
    }
    async findCityByIBGECode(ibgeCode) {
        const city = await city_model_1.CityModel.findByPk(ibgeCode, {
            include: [
                {
                    model: state_model_1.StateModel,
                    as: 'state',
                },
            ],
        });
        if (!city) {
            return null;
        }
        return city.toJSON();
    }
}
exports.CityRepository = CityRepository;
//# sourceMappingURL=city.repository.js.map