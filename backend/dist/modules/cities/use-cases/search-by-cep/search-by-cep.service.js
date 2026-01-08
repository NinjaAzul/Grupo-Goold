"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchByCEPService = void 0;
const search_by_cep_repository_1 = require("./search-by-cep.repository");
const integrations_1 = require("@shared/integrations");
const errors_1 = require("@shared/errors");
class SearchByCEPService {
    constructor() {
        this.searchByCEPRepository = new search_by_cep_repository_1.SearchByCEPRepository();
    }
    async execute(cep) {
        const viaCEPData = await integrations_1.viaCepApi.getAddressByCEP(cep);
        // 2. Buscar cidade pelo código IBGE retornado pela ViaCEP (já inclui o estado)
        const cityWithState = await this.searchByCEPRepository.findCityByIBGECode(Number(viaCEPData.ibge));
        if (!cityWithState || !cityWithState.state) {
            throw new errors_1.NotFoundError(`City with IBGE code ${viaCEPData.ibge} or its state not found in database`);
        }
        // 3. Retornar dados formatados
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