"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCitiesService = void 0;
const city_repository_1 = require("../../repositories/city.repository");
class ListCitiesService {
    constructor() {
        this.cityRepository = new city_repository_1.CityRepository();
    }
    async execute(query) {
        const cities = await this.cityRepository.findAll(query.stateId, query.uf);
        return {
            cities,
            total: cities.length,
        };
    }
}
exports.ListCitiesService = ListCitiesService;
//# sourceMappingURL=list.service.js.map