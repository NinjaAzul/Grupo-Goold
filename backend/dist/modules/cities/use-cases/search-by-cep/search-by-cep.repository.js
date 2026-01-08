"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchByCEPRepository = void 0;
const city_model_1 = require("../../model/city.model");
const state_model_1 = require("@modules/states/model/state.model");
class SearchByCEPRepository {
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
exports.SearchByCEPRepository = SearchByCEPRepository;
//# sourceMappingURL=search-by-cep.repository.js.map