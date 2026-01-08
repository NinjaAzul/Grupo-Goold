// Centralized route exports

//APP
export { healthCheckRoutes } from './health-check/use-cases/health-check/health-check.routes';

//USERS
export { createUserRoutes } from './users/use-cases/create/create.routes';
export { loginRoutes } from './users/use-cases/login/login.routes';

//STATES
export { syncStatesRoutes } from './states/use-cases/sync/sync.routes';
export { listStatesRoutes } from './states/use-cases/list/list.routes';

//CITIES
export { listCitiesRoutes } from './cities/use-cases/list/list.routes';
export { searchByCEPRoutes } from './cities/use-cases/search-by-cep/search-by-cep.routes';
