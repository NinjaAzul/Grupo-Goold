"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delete_service_1 = require("./delete.service");
const room_repository_1 = require("../../repositories/room.repository");
const errors_1 = require("@shared/errors");
// Mocks
jest.mock('../../repositories/room.repository');
describe('DeleteRoomService', () => {
    let deleteRoomService;
    let mockRoomRepository;
    beforeEach(() => {
        mockRoomRepository = new room_repository_1.RoomRepository();
        deleteRoomService = new delete_service_1.DeleteRoomService();
        deleteRoomService.roomRepository = mockRoomRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        it('should successfully delete room', async () => {
            const mockRoom = {
                id: 1,
                name: 'Sala A',
                startTime: '08:00',
                endTime: '18:00',
                timeBlock: 30,
            };
            mockRoomRepository.findById = jest.fn().mockResolvedValue(mockRoom);
            mockRoomRepository.countAppointmentsByRoomName = jest
                .fn()
                .mockResolvedValue(0);
            mockRoomRepository.delete = jest.fn().mockResolvedValue(true);
            await deleteRoomService.execute(1);
            expect(mockRoomRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRoomRepository.countAppointmentsByRoomName).toHaveBeenCalledWith('Sala A');
            expect(mockRoomRepository.delete).toHaveBeenCalledWith(1);
        });
        it('should throw NotFoundError when room does not exist', async () => {
            mockRoomRepository.findById = jest.fn().mockResolvedValue(null);
            await expect(deleteRoomService.execute(999)).rejects.toThrow(errors_1.NotFoundError);
            await expect(deleteRoomService.execute(999)).rejects.toThrow('Sala não encontrada');
            expect(mockRoomRepository.findById).toHaveBeenCalledWith(999);
            expect(mockRoomRepository.delete).not.toHaveBeenCalled();
        });
        it('should throw BadRequestError when room has associated appointments', async () => {
            const mockRoom = {
                id: 1,
                name: 'Sala A',
                startTime: '08:00',
                endTime: '18:00',
                timeBlock: 30,
            };
            mockRoomRepository.findById = jest.fn().mockResolvedValue(mockRoom);
            mockRoomRepository.countAppointmentsByRoomName = jest
                .fn()
                .mockResolvedValue(5);
            await expect(deleteRoomService.execute(1)).rejects.toThrow(errors_1.BadRequestError);
            await expect(deleteRoomService.execute(1)).rejects.toThrow('Não é possível excluir a sala. Existem 5 agendamento(s) associados a esta sala.');
            expect(mockRoomRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRoomRepository.countAppointmentsByRoomName).toHaveBeenCalledWith('Sala A');
            expect(mockRoomRepository.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=delete.service.test.js.map