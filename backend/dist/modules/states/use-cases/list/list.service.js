"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStatesService = void 0;
const state_repository_1 = require("../../repositories/state.repository");
class ListStatesService {
    constructor() {
        this.stateRepository = new state_repository_1.StateRepository();
    }
    async execute() {
        const states = await this.stateRepository.findAll();
        return {
            states,
            total: states.length,
        };
    }
}
exports.ListStatesService = ListStatesService;
//# sourceMappingURL=list.service.js.map