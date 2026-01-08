"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncStatesController = void 0;
const sync_service_1 = require("./sync.service");
class SyncStatesController {
    constructor() {
        this.handle = async (_req, res) => {
            const response = await this.syncStatesService.execute();
            return res.status(200).json(response);
        };
        this.syncStatesService = new sync_service_1.SyncStatesService();
    }
}
exports.SyncStatesController = SyncStatesController;
//# sourceMappingURL=sync.controller.js.map