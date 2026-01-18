import { DeleteRoomService } from './delete.service';
import { RoomRepository } from '../../repositories/room.repository';
import { NotFoundError, BadRequestError } from '@shared/errors';

// Mocks
jest.mock('../../repositories/room.repository');

describe('DeleteRoomService', () => {
  let deleteRoomService: DeleteRoomService;
  let mockRoomRepository: jest.Mocked<RoomRepository>;

  beforeEach(() => {
    mockRoomRepository = new RoomRepository() as jest.Mocked<RoomRepository>;
    deleteRoomService = new DeleteRoomService();
    (
      deleteRoomService as unknown as { roomRepository: RoomRepository }
    ).roomRepository = mockRoomRepository;
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
      expect(
        mockRoomRepository.countAppointmentsByRoomName
      ).toHaveBeenCalledWith('Sala A');
      expect(mockRoomRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when room does not exist', async () => {
      mockRoomRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(deleteRoomService.execute(999)).rejects.toThrow(
        NotFoundError
      );
      await expect(deleteRoomService.execute(999)).rejects.toThrow(
        'Sala não encontrada'
      );

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

      await expect(deleteRoomService.execute(1)).rejects.toThrow(
        BadRequestError
      );
      await expect(deleteRoomService.execute(1)).rejects.toThrow(
        'Não é possível excluir a sala. Existem 5 agendamento(s) associados a esta sala.'
      );

      expect(mockRoomRepository.findById).toHaveBeenCalledWith(1);
      expect(
        mockRoomRepository.countAppointmentsByRoomName
      ).toHaveBeenCalledWith('Sala A');
      expect(mockRoomRepository.delete).not.toHaveBeenCalled();
    });
  });
});
