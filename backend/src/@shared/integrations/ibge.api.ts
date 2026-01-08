import axios from 'axios';
import { logger } from '../utils';

interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

interface IBGECity {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
      };
    };
  };
}

class IBGEApi {
  private client: ReturnType<typeof axios.create>;
  private readonly baseURL =
    'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getStates(): Promise<IBGEState[]> {
    try {
      logger.info('Fetching states from IBGE API...');
      const response = await this.client.get<IBGEState[]>('/estados');
      logger.info(`Fetched ${response.data.length} states from IBGE API`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching states from IBGE API:', error);
      throw new Error('Failed to fetch states from IBGE API');
    }
  }

  async getCitiesByState(uf: string): Promise<IBGECity[]> {
    try {
      logger.info(`Fetching cities for state ${uf} from IBGE API...`);
      const response = await this.client.get<IBGECity[]>(
        `/estados/${uf}/municipios`
      );
      logger.info(
        `Fetched ${response.data.length} cities for state ${uf} from IBGE API`
      );
      return response.data;
    } catch (error) {
      logger.error(
        `Error fetching cities for state ${uf} from IBGE API:`,
        error
      );
      throw new Error(`Failed to fetch cities for state ${uf} from IBGE API`);
    }
  }
}

export const ibgeApi = new IBGEApi();
export type { IBGEState, IBGECity };
