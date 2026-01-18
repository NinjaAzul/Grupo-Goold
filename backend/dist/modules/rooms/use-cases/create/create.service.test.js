"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_service_1 = require("./create.service");
const room_repository_1 = require("../../repositories/room.repository");
const room_model_1 = require("@modules/rooms/model/room.model");
const errors_1 = require("@shared/errors");
// Mocks
jest.mock('../../repositories/room.repository');
jest.mock('@modules/rooms/model/room.model');
describe('CreateRoomService', () => {
    let createRoomService;
    let mockRoomRepository;
    const mockRoomModel = room_model_1.RoomModel;
    beforeEach(() => {
        mockRoomRepository = new room_repository_1.RoomRepository();
        createRoomService = new create_service_1.CreateRoomService();
        createRoomService.roomRepository = mockRoomRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const validRoomRequest = {
            name: 'Sala A',
            startTime: '08:00',
            endTime: '18:00',
            timeBlock: 30,
        };
        const mockCreatedRoom = {
            id: 1,
            name: 'Sala A',
            startTime: '08:00',
            endTime: '18:00',
            timeBlock: 30,
        };
        it('should throw BadRequestError when room with same name already exists', async () => {
            mockRoomModel.findOne = jest.fn().mockResolvedValue({
                id: 1,
                name: 'Sala A',
                startTime: '08:00',
                endTime: '18:00',
                timeBlock: 30,
            });
            await expect(createRoomService.execute(validRoomRequest)).rejects.toThrow(errors_1.BadRequestError);
            await expect(createRoomService.execute(validRoomRequest)).rejects.toThrow('Já existe uma sala com este nome');
            expect(mockRoomModel.findOne).toHaveBeenCalledWith({
                where: { name: 'Sala A' },
            });
            expect(mockRoomRepository.create).not.toHaveBeenCalled();
        });
        it('should create room successfully when name is unique', async () => {
            mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
            mockRoomRepository.create = jest.fn().mockResolvedValue(mockCreatedRoom);
            const result = await createRoomService.execute(validRoomRequest);
            expect(mockRoomModel.findOne).toHaveBeenCalledWith({
                where: { name: 'Sala A' },
            });
            expect(mockRoomRepository.create).toHaveBeenCalledWith(validRoomRequest);
            expect(result.room).toEqual(mockCreatedRoom);
        });
        it('should throw error when repository create returns null', async () => {
            mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
            mockRoomRepository.create = jest.fn().mockResolvedValue(null);
            await expect(createRoomService.execute(validRoomRequest)).rejects.toThrow('Falha ao criar sala');
            expect(mockRoomModel.findOne).toHaveBeenCalledWith({
                where: { name: 'Sala A' },
            });
            expect(mockRoomRepository.create).toHaveBeenCalledWith(validRoomRequest);
        });
        it('should create room with different valid data', async () => {
            const differentRoomRequest = {
                name: 'Sala B',
                startTime: '09:00',
                endTime: '17:00',
                timeBlock: 60,
            };
            const differentCreatedRoom = {
                id: 2,
                name: 'Sala B',
                startTime: '09:00',
                endTime: '17:00',
                timeBlock: 60,
            };
            mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
            mockRoomRepository.create = jest
                .fn()
                .mockResolvedValue(differentCreatedRoom);
            const result = await createRoomService.execute(differentRoomRequest);
            expect(mockRoomModel.findOne).toHaveBeenCalledWith({
                where: { name: 'Sala B' },
            });
            expect(mockRoomRepository.create).toHaveBeenCalledWith(differentRoomRequest);
            expect(result.room).toEqual(differentCreatedRoom);
        });
    });
});
//# sourceMappingURL=create.service.test.js.map