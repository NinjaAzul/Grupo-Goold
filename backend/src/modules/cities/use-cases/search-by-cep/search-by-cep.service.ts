import { SearchByCEPRepository } from './search-by-cep.repository';
import { ISearchByCEPResponse } from './search-by-cep.interface';
import { viaCepApi } from '@shared/integrations';
import { NotFoundError } from '@shared/errors';

export class SearchByCEPService {
  private searchByCEPRepository: SearchByCEPRepository;

  constructor() {
    this.searchByCEPRepository = new SearchByCEPRepository();
  }

  async execute(cep: string): Promise<ISearchByCEPResponse> {
    const viaCEPData = await viaCepApi.getAddressByCEP(cep);

    // 2. Buscar cidade pelo código IBGE retornado pela ViaCEP (já inclui o estado)
    const cityWithState = await this.searchByCEPRepository.findCityByIBGECode(
      Number(viaCEPData.ibge)
    );

    if (!cityWithState || !cityWithState.state) {
      throw new NotFoundError(
        `City with IBGE code ${viaCEPData.ibge} or its state not found in database`
      );
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
