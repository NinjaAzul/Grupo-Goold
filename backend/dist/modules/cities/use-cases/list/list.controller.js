"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCitiesController = void 0;
const list_service_1 = require("./list.service");
class ListCitiesController {
    constructor() {
        this.handle = async (req, res, next) => {
            try {
                const query = req.query;
                const response = await this.listCitiesService.execute({
                    stateId: query.stateId,
                    uf: query.uf?.toUpperCase(),
                });
                return res.status(200).json(response);
            }
            catch (error) {
                return next(error);
            }
        };
        this.listCitiesService = new list_service_1.ListCitiesService();
    }
}
exports.ListCitiesController = ListCitiesController;
//# sourceMappingURL=list.controller.js.map