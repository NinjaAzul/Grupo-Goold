"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viaCepApi = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
class ViaCEPApi {
    constructor() {
        this.baseURL = 'https://viacep.com.br/ws';
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            timeout: 10000, // 10 segundos
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async getAddressByCEP(cep) {
        try {
            const cleanCEP = cep.replace(/\D/g, '');
            if (cleanCEP.length !== 8) {
                throw new Error('CEP inválido. Deve conter 8 dígitos');
            }
            utils_1.logger.info(`Fetching address for CEP ${cep} from ViaCEP API...`);
            const response = await this.client.get(`/${cleanCEP}/json`);
            if (response.data.erro) {
                throw new Error('CEP não encontrado');
            }
            utils_1.logger.info(`Address found for CEP ${cep}`);
            return response.data;
        }
        catch (error) {
            utils_1.logger.error(`Error fetching address for CEP ${cep} from ViaCEP API:`, error);
            throw new Error(`Failed to fetch address for CEP ${cep}`);
        }
    }
}
exports.viaCepApi = new ViaCEPApi();
//# sourceMappingURL=viacep.api.js.map