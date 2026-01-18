"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const health_check_service_1 = require("./health-check.service");
describe('CheckHealthService', () => {
    let checkHealthService;
    beforeEach(() => {
        checkHealthService = new health_check_service_1.CheckHealthService();
    });
    describe('execute', () => {
        it('should return health status ok', async () => {
            const result = await checkHealthService.execute();
            expect(result.health).toBe('ok');
        });
    });
});
//# sourceMappingURL=health-check.service.test.js.map