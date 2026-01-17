"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableSlotsService = void 0;
const available_slots_repository_1 = require("./available-slots.repository");
class AvailableSlotsService {
    constructor() {
        this.repository = new available_slots_repository_1.AvailableSlotsRepository();
    }
    async execute(request) {
        // Validar que a data não é no passado
        const requestDate = new Date(request.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (requestDate < today) {
            return { slots: [] };
        }
        const slots = await this.repository.getAvailableSlots(request);
        return { slots };
    }
}
exports.AvailableSlotsService = AvailableSlotsService;
//# sourceMappingURL=available-slots.service.js.map