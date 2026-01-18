import { CityRepository } from '../../repositories/city.repository';
import { ISearchByCEPResponse } from './search-by-cep.interface';
import { viaCepApi } from '@shared/integrations';
import { NotFoundError } from '@shared/errors';

export class SearchByCEPService {
  private cityRepository: CityRepository;

  constructor() {
    this.cityRepository = new CityRepository();
  }

  async execute(cep: string): Promise<ISearchByCEPResponse> {
    const viaCEPData = await viaCepApi.getAddressByCEP(cep);

    const cityWithState = await this.cityRepository.findCityByIBGECode(
      Number(viaCEPData.ibge)
    );

    if (!cityWithState || !cityWithState.state) {
      throw new NotFoundError(
        `Cidade com código IBGE ${viaCEPData.ibge} ou seu estado não encontrado no banco de dados`
      );
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
