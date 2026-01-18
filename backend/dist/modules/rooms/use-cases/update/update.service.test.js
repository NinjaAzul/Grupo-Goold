"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_service_1 = require("./update.service");
const room_repository_1 = require("../../repositories/room.repository");
const room_model_1 = require("@modules/rooms/model/room.model");
const errors_1 = require("@shared/errors");
// Mocks
jest.mock('../../repositories/room.repository');
jest.mock('@modules/rooms/model/room.model');
describe('UpdateRoomService', () => {
    let updateRoomService;
    let mockRoomRepository;
    const mockRoomModel = room_model_1.RoomModel;
    beforeEach(() => {
        mockRoomRepository = new room_repository_1.RoomRepository();
        updateRoomService = new update_service_1.UpdateRoomService();
        updateRoomService.roomRepository = mockRoomRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const existingRoom = {
            id: 1,
            name: 'Sala A',
            startTime: '08:00',
            endTime: '18:00',
            timeBlock: 30,
        };
        it('should throw NotFoundError when room does not exist', async () => {
            mockRoomModel.findByPk = jest.fn().mockResolvedValue(null);
            const updateData = {
                name: 'Sala B',
            };
            await expect(updateRoomService.execute(999, updateData)).rejects.toThrow(errors_1.NotFoundError);
            await expect(updateRoomService.execute(999, updateData)).rejects.toThrow('Sala não encontrada');
            expect(mockRoomModel.findByPk).toHaveBeenCalledWith(999);
        });
        it('should throw BadRequestError when new name already exists', async () => {
            mockRoomModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingRoom);
            mockRoomModel.findOne = jest.fn().mockResolvedValue({
                id: 2,
                name: 'Sala B',
            });
            const updateData = {
                name: 'Sala B',
            };
            await expect(updateRoomService.execute(1, updateData)).rejects.toThrow(errors_1.BadRequestError);
            await expect(updateRoomService.execute(1, updateData)).rejects.toThrow('Já existe uma sala com este nome');
            expect(mockRoomModel.findByPk).toHaveBeenCalledWith(1);
            expect(mockRoomModel.findOne).toHaveBeenCalledWith({
                where: { name: 'Sala B' },
            });
        });
        it('should allow updating name to the same name', async () => {
            mockRoomModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingRoom);
            const updatedRoom = {
                ...existingRoom,
                name: 'Sala A',
            };
            mockRoomRepository.update = jest
                .fn()
                .mockResolvedValue(updatedRoom);
            const updateData = {
                name: 'Sala A',
            };
            const result = await updateRoomService.execute(1, updateData);
            expect(mockRoomModel.findOne).not.toHaveBeenCalled();
            expect(mockRoomRepository.update).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedRoom);
        });
        it('should successfully update room without name change', async () => {
            const updatedRoom = {
                ...existingRoom,
                startTime: '09:00',
                endTime: '17:00',
            };
            mockRoomModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingRoom);
            mockRoomRepository.update = jest
                .fn()
                .mockResolvedValue(updatedRoom);
            const updateData = {
                startTime: '09:00',
                endTime: '17:00',
            };
            const result = await updateRoomService.execute(1, updateData);
            expect(mockRoomModel.findOne).not.toHaveBeenCalled();
            expect(mockRoomRepository.update).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedRoom);
        });
        it('should successfully update room with new unique name', async () => {
            const updatedRoom = {
                ...existingRoom,
                name: 'Sala Nova',
            };
            mockRoomModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingRoom);
            mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
            mockRoomRepository.update = jest
                .fn()
                .mockResolvedValue(updatedRoom);
            const updateData = {
                name: 'Sala Nova',
            };
            const result = await updateRoomService.execute(1, updateData);
            expect(mockRoomModel.findOne).toHaveBeenCalledWith({
                where: { name: 'Sala Nova' },
            });
            expect(mockRoomRepository.update).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedRoom);
        });
        it('should throw NotFoundError when repository update returns null', async () => {
            mockRoomModel.findByPk = jest
                .fn()
                .mockResolvedValue(existingRoom);
            mockRoomRepository.update = jest.fn().mockResolvedValue(null);
            const updateData = {
                name: 'Sala Nova',
            };
            await expect(updateRoomService.execute(1, updateData)).rejects.toThrow(errors_1.NotFoundError);
            await expect(updateRoomService.execute(1, updateData)).rejects.toThrow('Sala não encontrada');
        });
    });
});
//# sourceMappingURL=update.service.test.js.map