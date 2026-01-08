"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStatesService = void 0;
const list_repository_1 = require("./list.repository");
class ListStatesService {
    constructor() {
        this.listStatesRepository = new list_repository_1.ListStatesRepository();
    }
    async execute() {
        const states = await this.listStatesRepository.findAll();
        return {
            states,
            total: states.length,
        };
    }
}
exports.ListStatesService = ListStatesService;
//# sourceMappingURL=list.service.js.map