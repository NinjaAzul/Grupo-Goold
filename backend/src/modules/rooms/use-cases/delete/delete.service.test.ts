import { DeleteRoomService } from './delete.service';
import { DeleteRoomRepository } from './delete.repository';
import { NotFoundError, BadRequestError } from '@shared/errors';

// Mocks
jest.mock('./delete.repository');

describe('DeleteRoomService', () => {
  let deleteRoomService: DeleteRoomService;
  let mockDeleteRoomRepository: jest.Mocked<DeleteRoomRepository>;

  beforeEach(() => {
    mockDeleteRoomRepository =
      new DeleteRoomRepository() as jest.Mocked<DeleteRoomRepository>;
    deleteRoomService = new DeleteRoomService();
    (
      deleteRoomService as unknown as { repository: DeleteRoomRepository }
    ).repository = mockDeleteRoomRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully delete room', async () => {
      mockDeleteRoomRepository.delete = jest.fn().mockResolvedValue(undefined);

      await deleteRoomService.execute(1);

      expect(mockDeleteRoomRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when room does not exist', async () => {
      mockDeleteRoomRepository.delete = jest
        .fn()
        .mockRejectedValue(new NotFoundError('Room not found'));

      await expect(deleteRoomService.execute(999)).rejects.toThrow(
        NotFoundError
      );
      await expect(deleteRoomService.execute(999)).rejects.toThrow(
        'Room not found'
      );

      expect(mockDeleteRoomRepository.delete).toHaveBeenCalledWith(999);
    });

    it('should throw BadRequestError when room has associated appointments', async () => {
      mockDeleteRoomRepository.delete = jest
        .fn()
        .mockRejectedValue(
          new BadRequestError(
            'Cannot delete room. There are 5 appointment(s) associated with this room.'
          )
        );

      await expect(deleteRoomService.execute(1)).rejects.toThrow(
        BadRequestError
      );
      await expect(deleteRoomService.execute(1)).rejects.toThrow(
        'Cannot delete room. There are 5 appointment(s) associated with this room.'
      );
    });
  });
});
