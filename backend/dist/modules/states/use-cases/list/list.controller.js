"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStatesController = void 0;
const list_service_1 = require("./list.service");
class ListStatesController {
    constructor() {
        this.handle = async (_req, res) => {
            const response = await this.listStatesService.execute();
            return res.status(200).json(response);
        };
        this.listStatesService = new list_service_1.ListStatesService();
    }
}
exports.ListStatesController = ListStatesController;
//# sourceMappingURL=list.controller.js.map