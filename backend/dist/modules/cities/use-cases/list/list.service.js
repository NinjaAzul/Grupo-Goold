"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCitiesService = void 0;
const list_repository_1 = require("./list.repository");
class ListCitiesService {
    constructor() {
        this.listCitiesRepository = new list_repository_1.ListCitiesRepository();
    }
    async execute(query) {
        const cities = await this.listCitiesRepository.findAll(query.stateId, query.uf);
        return {
            cities,
            total: cities.length,
        };
    }
}
exports.ListCitiesService = ListCitiesService;
//# sourceMappingURL=list.service.js.map