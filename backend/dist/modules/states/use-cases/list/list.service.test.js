"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_service_1 = require("./list.service");
const state_repository_1 = require("../../repositories/state.repository");
// Mocks
jest.mock('../../repositories/state.repository');
describe('ListStatesService', () => {
    let listStatesService;
    let mockStateRepository;
    beforeEach(() => {
        mockStateRepository = new state_repository_1.StateRepository();
        listStatesService = new list_service_1.ListStatesService();
        listStatesService.stateRepository = mockStateRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockStates = [
            {
                id: 35,
                name: 'São Paulo',
                uf: 'SP',
            },
            {
                id: 33,
                name: 'Rio de Janeiro',
                uf: 'RJ',
            },
        ];
        it('should return all states', async () => {
            mockStateRepository.findAll = jest
                .fn()
                .mockResolvedValue(mockStates);
            const result = await listStatesService.execute();
            expect(mockStateRepository.findAll).toHaveBeenCalled();
            expect(result.states).toEqual(mockStates);
            expect(result.total).toBe(2);
        });
        it('should handle empty results', async () => {
            mockStateRepository.findAll = jest.fn().mockResolvedValue([]);
            const result = await listStatesService.execute();
            expect(result.states).toEqual([]);
            expect(result.total).toBe(0);
        });
    });
});
//# sourceMappingURL=list.service.test.js.map