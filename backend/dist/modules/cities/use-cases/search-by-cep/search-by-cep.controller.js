"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchByCEPController = void 0;
const search_by_cep_service_1 = require("./search-by-cep.service");
class SearchByCEPController {
    constructor() {
        this.handle = async (req, res) => {
            const { cep } = req.params;
            const response = await this.searchByCEPService.execute(cep);
            return res.status(200).json(response);
        };
        this.searchByCEPService = new search_by_cep_service_1.SearchByCEPService();
    }
}
exports.SearchByCEPController = SearchByCEPController;
//# sourceMappingURL=search-by-cep.controller.js.map