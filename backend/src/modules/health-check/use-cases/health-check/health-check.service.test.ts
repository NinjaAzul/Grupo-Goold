import { CheckHealthService } from './health-check.service';

describe('CheckHealthService', () => {
  let checkHealthService: CheckHealthService;

  beforeEach(() => {
    checkHealthService = new CheckHealthService();
  });

  describe('execute', () => {
    it('should return health status ok', async () => {
      const result = await checkHealthService.execute();

      expect(result.health).toBe('ok');
    });
  });
});
