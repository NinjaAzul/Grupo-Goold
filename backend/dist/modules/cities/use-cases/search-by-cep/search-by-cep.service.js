"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchByCEPService = void 0;
const city_repository_1 = require("../../repositories/city.repository");
const integrations_1 = require("@shared/integrations");
const errors_1 = require("@shared/errors");
class SearchByCEPService {
    constructor() {
        this.cityRepository = new city_repository_1.CityRepository();
    }
    async execute(cep) {
        const viaCEPData = await integrations_1.viaCepApi.getAddressByCEP(cep);
        const cityWithState = await this.cityRepository.findCityByIBGECode(Number(viaCEPData.ibge));
        if (!cityWithState || !cityWithState.state) {
            throw new errors_1.NotFoundError(`Cidade com código IBGE ${viaCEPData.ibge} ou seu estado não encontrado no banco de dados`);
        }
        return {
            cep: viaCEPData.cep,
            street: viaCEPData.logradouro,
            complement: viaCEPData.complemento,
            neighborhood: viaCEPData.bairro,
            city: {
                id: cityWithState.id,
                name: cityWithState.name,
                stateId: cityWithState.stateId,
            },
            state: cityWithState.state,
        };
    }
}
exports.SearchByCEPService = SearchByCEPService;
//# sourceMappingURL=search-by-cep.service.js.map