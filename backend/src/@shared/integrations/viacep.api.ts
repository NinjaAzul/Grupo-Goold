import axios from 'axios';
import { logger } from '../utils';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

class ViaCEPApi {
  private client: ReturnType<typeof axios.create>;
  private readonly baseURL = 'https://viacep.com.br/ws';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getAddressByCEP(cep: string): Promise<ViaCEPResponse> {
    try {
      const cleanCEP = cep.replace(/\D/g, '');

      if (cleanCEP.length !== 8) {
        throw new Error('CEP inválido. Deve conter 8 dígitos');
      }

      logger.info(`Fetching address for CEP ${cep} from ViaCEP API...`);
      const response = await this.client.get<ViaCEPResponse>(
        `/${cleanCEP}/json`
      );

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      logger.info(`Address found for CEP ${cep}`);
      return response.data;
    } catch (error) {
      logger.error(
        `Error fetching address for CEP ${cep} from ViaCEP API:`,
        error
      );
      throw new Error(`Failed to fetch address for CEP ${cep}`);
    }
  }
}

export const viaCepApi = new ViaCEPApi();
export type { ViaCEPResponse };
