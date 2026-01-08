"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStatesRepository = void 0;
const state_model_1 = require("../../model/state.model");
class ListStatesRepository {
    async findAll() {
        const states = await state_model_1.StateModel.findAll({
            order: [['uf', 'ASC']],
        });
        return states.map((state) => state.toJSON());
    }
}
exports.ListStatesRepository = ListStatesRepository;
//# sourceMappingURL=list.repository.js.map