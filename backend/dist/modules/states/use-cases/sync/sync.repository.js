"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncStatesRepository = void 0;
const state_model_1 = require("../../model/state.model");
const city_model_1 = require("@modules/cities/model/city.model");
class SyncStatesRepository {
    async bulkCreateStates(states) {
        const created = await state_model_1.StateModel.bulkCreate(states, {
            updateOnDuplicate: ['name', 'uf', 'updatedAt'],
        });
        return created.length;
    }
    async bulkCreateCities(cities) {
        const created = await city_model_1.CityModel.bulkCreate(cities, {
            updateOnDuplicate: ['name', 'stateId', 'updatedAt'],
        });
        return created.length;
    }
    async getAllStates() {
        const states = await state_model_1.StateModel.findAll({
            order: [['uf', 'ASC']],
        });
        return states.map((state) => state.toJSON());
    }
}
exports.SyncStatesRepository = SyncStatesRepository;
//# sourceMappingURL=sync.repository.js.map