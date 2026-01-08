"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ibgeApi = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
class IBGEApi {
    constructor() {
        this.baseURL = 'https://servicodados.ibge.gov.br/api/v1/localidades';
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            timeout: 30000, // 30 segundos
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async getStates() {
        try {
            utils_1.logger.info('Fetching states from IBGE API...');
            const response = await this.client.get('/estados');
            utils_1.logger.info(`Fetched ${response.data.length} states from IBGE API`);
            return response.data;
        }
        catch (error) {
            utils_1.logger.error('Error fetching states from IBGE API:', error);
            throw new Error('Failed to fetch states from IBGE API');
        }
    }
    async getCitiesByState(uf) {
        try {
            utils_1.logger.info(`Fetching cities for state ${uf} from IBGE API...`);
            const response = await this.client.get(`/estados/${uf}/municipios`);
            utils_1.logger.info(`Fetched ${response.data.length} cities for state ${uf} from IBGE API`);
            return response.data;
        }
        catch (error) {
            utils_1.logger.error(`Error fetching cities for state ${uf} from IBGE API:`, error);
            throw new Error(`Failed to fetch cities for state ${uf} from IBGE API`);
        }
    }
}
exports.ibgeApi = new IBGEApi();
//# sourceMappingURL=ibge.api.js.map