"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncStatesService = void 0;
const sync_repository_1 = require("./sync.repository");
const integrations_1 = require("@shared/integrations");
const utils_1 = require("@shared/utils");
const errors_1 = require("@shared/errors");
class SyncStatesService {
    constructor() {
        this.syncStatesRepository = new sync_repository_1.SyncStatesRepository();
    }
    async execute() {
        try {
            utils_1.logger.info('Starting states and cities synchronization...');
            const ibgeStates = await integrations_1.ibgeApi.getStates();
            const statesToSave = ibgeStates.map((state) => ({
                id: state.id,
                name: state.nome,
                uf: state.sigla,
            }));
            const statesCount = await this.syncStatesRepository.bulkCreateStates(statesToSave);
            utils_1.logger.info(`Synchronized ${statesCount} states`);
            let totalCitiesCount = 0;
            const citiesPromises = [];
            for (const state of ibgeStates) {
                const promise = (async () => {
                    try {
                        const ibgeCities = await integrations_1.ibgeApi.getCitiesByState(state.sigla);
                        const citiesToSave = ibgeCities.map((city) => ({
                            id: city.id,
                            name: city.nome,
                            stateId: state.id,
                        }));
                        const citiesCount = await this.syncStatesRepository.bulkCreateCities(citiesToSave);
                        totalCitiesCount += citiesCount;
                        utils_1.logger.info(`Synchronized ${citiesCount} cities for state ${state.sigla}`);
                    }
                    catch (error) {
                        utils_1.logger.error(`Error synchronizing cities for state ${state.sigla}:`, error);
                    }
                })();
                citiesPromises.push(promise);
            }
            await Promise.all(citiesPromises);
            utils_1.logger.info(`Synchronization completed: ${statesCount} states, ${totalCitiesCount} cities`);
            return {
                statesCount,
                citiesCount: totalCitiesCount,
                message: `Successfully synchronized ${statesCount} states and ${totalCitiesCount} cities`,
            };
        }
        catch (error) {
            utils_1.logger.error('Error during synchronization:', error);
            throw new errors_1.InternalServerError('Failed to synchronize states and cities');
        }
    }
}
exports.SyncStatesService = SyncStatesService;
//# sourceMappingURL=sync.service.js.map