"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRepository = void 0;
const state_model_1 = require("../model/state.model");
const city_model_1 = require("@modules/cities/model/city.model");
class StateRepository {
    /**
     * Lista todos os estados
     */
    async findAll() {
        const states = await state_model_1.StateModel.findAll({
            order: [['uf', 'ASC']],
        });
        return states.map((state) => state.toJSON());
    }
    /**
     * Sincroniza estados em lote
     */
    async bulkCreateStates(states) {
        const created = await state_model_1.StateModel.bulkCreate(states, {
            updateOnDuplicate: ['name', 'uf', 'updatedAt'],
        });
        return created.length;
    }
    /**
     * Sincroniza cidades em lote
     */
    async bulkCreateCities(cities) {
        const created = await city_model_1.CityModel.bulkCreate(cities, {
            updateOnDuplicate: ['name', 'stateId', 'updatedAt'],
        });
        return created.length;
    }
    /**
     * Retorna todos os estados (para sincronização)
     */
    async getAllStates() {
        const states = await state_model_1.StateModel.findAll({
            order: [['uf', 'ASC']],
        });
        return states.map((state) => state.toJSON());
    }
}
exports.StateRepository = StateRepository;
//# sourceMappingURL=state.repository.js.map