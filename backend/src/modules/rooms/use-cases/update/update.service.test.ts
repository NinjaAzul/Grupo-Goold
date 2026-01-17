import { UpdateRoomService } from './update.service';
import { UpdateRoomRepository } from './update.repository';
import { RoomModel } from '@modules/rooms/model/room.model';
import { NotFoundError, BadRequestError } from '@shared/errors';
import { UpdateRoomDto } from './update.dto';
import { IRoom } from '@modules/rooms/model/room.interface';

// Mocks
jest.mock('./update.repository');
jest.mock('@modules/rooms/model/room.model');

describe('UpdateRoomService', () => {
  let updateRoomService: UpdateRoomService;
  let mockUpdateRoomRepository: jest.Mocked<UpdateRoomRepository>;
  const mockRoomModel = RoomModel as jest.Mocked<typeof RoomModel>;

  beforeEach(() => {
    mockUpdateRoomRepository =
      new UpdateRoomRepository() as jest.Mocked<UpdateRoomRepository>;
    updateRoomService = new UpdateRoomService();
    (
      updateRoomService as unknown as { repository: UpdateRoomRepository }
    ).repository = mockUpdateRoomRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const existingRoom: Partial<IRoom> = {
      id: 1,
      name: 'Sala A',
      startTime: '08:00',
      endTime: '18:00',
      timeBlock: 30,
    };

    it('should throw NotFoundError when room does not exist', async () => {
      mockRoomModel.findByPk = jest.fn().mockResolvedValue(null);

      const updateData: UpdateRoomDto = {
        name: 'Sala B',
      };

      await expect(updateRoomService.execute(999, updateData)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateRoomService.execute(999, updateData)).rejects.toThrow(
        'Room not found'
      );

      expect(mockRoomModel.findByPk).toHaveBeenCalledWith(999);
    });

    it('should throw BadRequestError when new name already exists', async () => {
      mockRoomModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingRoom as IRoom);
      mockRoomModel.findOne = jest.fn().mockResolvedValue({
        id: 2,
        name: 'Sala B',
      } as IRoom);

      const updateData: UpdateRoomDto = {
        name: 'Sala B',
      };

      await expect(updateRoomService.execute(1, updateData)).rejects.toThrow(
        BadRequestError
      );
      await expect(updateRoomService.execute(1, updateData)).rejects.toThrow(
        'Room with this name already exists'
      );

      expect(mockRoomModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockRoomModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Sala B' },
      });
    });

    it('should allow updating name to the same name', async () => {
      mockRoomModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingRoom as IRoom);
      const updatedRoom: Partial<IRoom> = {
        ...existingRoom,
        name: 'Sala A',
      };
      mockUpdateRoomRepository.update = jest
        .fn()
        .mockResolvedValue(updatedRoom as IRoom);

      const updateData: UpdateRoomDto = {
        name: 'Sala A',
      };

      const result = await updateRoomService.execute(1, updateData);

      expect(mockRoomModel.findOne).not.toHaveBeenCalled();
      expect(mockUpdateRoomRepository.update).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(result).toEqual(updatedRoom);
    });

    it('should successfully update room without name change', async () => {
      const updatedRoom: Partial<IRoom> = {
        ...existingRoom,
        startTime: '09:00',
        endTime: '17:00',
      };

      mockRoomModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingRoom as IRoom);
      mockUpdateRoomRepository.update = jest
        .fn()
        .mockResolvedValue(updatedRoom as IRoom);

      const updateData: UpdateRoomDto = {
        startTime: '09:00',
        endTime: '17:00',
      };

      const result = await updateRoomService.execute(1, updateData);

      expect(mockRoomModel.findOne).not.toHaveBeenCalled();
      expect(mockUpdateRoomRepository.update).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(result).toEqual(updatedRoom);
    });

    it('should successfully update room with new unique name', async () => {
      const updatedRoom: Partial<IRoom> = {
        ...existingRoom,
        name: 'Sala Nova',
      };

      mockRoomModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingRoom as IRoom);
      mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
      mockUpdateRoomRepository.update = jest
        .fn()
        .mockResolvedValue(updatedRoom as IRoom);

      const updateData: UpdateRoomDto = {
        name: 'Sala Nova',
      };

      const result = await updateRoomService.execute(1, updateData);

      expect(mockRoomModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Sala Nova' },
      });
      expect(mockUpdateRoomRepository.update).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(result).toEqual(updatedRoom);
    });

    it('should throw NotFoundError when repository update returns null', async () => {
      mockRoomModel.findByPk = jest
        .fn()
        .mockResolvedValue(existingRoom as IRoom);
      mockUpdateRoomRepository.update = jest.fn().mockResolvedValue(null);

      const updateData: UpdateRoomDto = {
        name: 'Sala Nova',
      };

      await expect(updateRoomService.execute(1, updateData)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateRoomService.execute(1, updateData)).rejects.toThrow(
        'Room not found'
      );
    });
  });
});
