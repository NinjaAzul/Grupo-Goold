"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCitiesController = void 0;
const list_service_1 = require("./list.service");
class ListCitiesController {
    constructor() {
        this.handle = async (req, res) => {
            const stateId = req.query.stateId ? Number(req.query.stateId) : undefined;
            const uf = req.query.uf ? String(req.query.uf).toUpperCase() : undefined;
            const response = await this.listCitiesService.execute({
                stateId,
                uf,
            });
            return res.status(200).json(response);
        };
        this.listCitiesService = new list_service_1.ListCitiesService();
    }
}
exports.ListCitiesController = ListCitiesController;
//# sourceMappingURL=list.controller.js.map