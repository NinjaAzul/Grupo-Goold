"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRoomsService = void 0;
const list_repository_1 = require("./list.repository");
class ListRoomsService {
    constructor() {
        this.repository = new list_repository_1.ListRoomsRepository();
    }
    async execute() {
        return await this.repository.findAll();
    }
}
exports.ListRoomsService = ListRoomsService;
//# sourceMappingURL=list.service.js.map