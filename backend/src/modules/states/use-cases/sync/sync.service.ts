import { SyncStatesRepository } from './sync.repository';
import { ISyncStatesResponse } from './sync.interface';
import { ibgeApi } from '@shared/integrations';
import { logger } from '@shared/utils';
import { InternalServerError } from '@shared/errors';

export class SyncStatesService {
  private syncStatesRepository: SyncStatesRepository;

  constructor() {
    this.syncStatesRepository = new SyncStatesRepository();
  }

  async execute(): Promise<ISyncStatesResponse> {
    try {
      logger.info('Starting states and cities synchronization...');

      const ibgeStates = await ibgeApi.getStates();

      const statesToSave = ibgeStates.map((state) => ({
        id: state.id,
        name: state.nome,
        uf: state.sigla,
      }));

      const statesCount =
        await this.syncStatesRepository.bulkCreateStates(statesToSave);
      logger.info(`Synchronized ${statesCount} states`);

      let totalCitiesCount = 0;
      const citiesPromises: Promise<void>[] = [];

      for (const state of ibgeStates) {
        const promise = (async () => {
          try {
            const ibgeCities = await ibgeApi.getCitiesByState(state.sigla);

            const citiesToSave = ibgeCities.map((city) => ({
              id: city.id,
              name: city.nome,
              stateId: state.id,
            }));

            const citiesCount =
              await this.syncStatesRepository.bulkCreateCities(citiesToSave);
            totalCitiesCount += citiesCount;
            logger.info(
              `Synchronized ${citiesCount} cities for state ${state.sigla}`
            );
          } catch (error) {
            logger.error(
              `Error synchronizing cities for state ${state.sigla}:`,
              error
            );
          }
        })();

        citiesPromises.push(promise);
      }

      await Promise.all(citiesPromises);

      logger.info(
        `Synchronization completed: ${statesCount} states, ${totalCitiesCount} cities`
      );

      return {
        statesCount,
        citiesCount: totalCitiesCount,
        message: `Successfully synchronized ${statesCount} states and ${totalCitiesCount} cities`,
      };
    } catch (error) {
      logger.error('Error during synchronization:', error);
      throw new InternalServerError('Failed to synchronize states and cities');
    }
  }
}
