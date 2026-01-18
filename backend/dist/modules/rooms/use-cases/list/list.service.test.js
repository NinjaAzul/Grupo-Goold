"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_service_1 = require("./list.service");
const room_repository_1 = require("../../repositories/room.repository");
// Mocks
jest.mock('../../repositories/room.repository');
describe('ListRoomsService', () => {
    let listRoomsService;
    let mockRoomRepository;
    beforeEach(() => {
        mockRoomRepository = new room_repository_1.RoomRepository();
        listRoomsService = new list_service_1.ListRoomsService();
        listRoomsService.roomRepository = mockRoomRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockRooms = [
            {
                id: 1,
                name: 'Sala A',
                startTime: '08:00',
                endTime: '18:00',
                timeBlock: 30,
            },
            {
                id: 2,
                name: 'Sala B',
                startTime: '09:00',
                endTime: '17:00',
                timeBlock: 60,
            },
        ];
        it('should return all rooms', async () => {
            mockRoomRepository.findAll = jest
                .fn()
                .mockResolvedValue(mockRooms);
            const result = await listRoomsService.execute();
            expect(mockRoomRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockRooms);
        });
        it('should handle empty results', async () => {
            mockRoomRepository.findAll = jest.fn().mockResolvedValue([]);
            const result = await listRoomsService.execute();
            expect(result).toEqual([]);
        });
    });
});
//# sourceMappingURL=list.service.test.js.map