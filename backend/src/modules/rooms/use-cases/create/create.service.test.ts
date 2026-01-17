import { CreateRoomService } from './create.service';
import { CreateRoomRepository } from './create.repository';
import { RoomModel } from '@modules/rooms/model/room.model';
import { BadRequestError } from '@shared/errors';
import { ICreateRoomRequest } from './create.interface';
import { IRoom } from '@modules/rooms/model/room.interface';

// Mocks
jest.mock('./create.repository');
jest.mock('@modules/rooms/model/room.model');

describe('CreateRoomService', () => {
  let createRoomService: CreateRoomService;
  let mockCreateRoomRepository: jest.Mocked<CreateRoomRepository>;
  const mockRoomModel = RoomModel as jest.Mocked<typeof RoomModel>;

  beforeEach(() => {
    mockCreateRoomRepository =
      new CreateRoomRepository() as jest.Mocked<CreateRoomRepository>;
    createRoomService = new CreateRoomService();
    (
      createRoomService as unknown as { repository: CreateRoomRepository }
    ).repository = mockCreateRoomRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validRoomRequest: ICreateRoomRequest = {
      name: 'Sala A',
      startTime: '08:00',
      endTime: '18:00',
      timeBlock: 30,
    };

    const mockCreatedRoom: IRoom = {
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
      } as IRoom);

      await expect(createRoomService.execute(validRoomRequest)).rejects.toThrow(
        BadRequestError
      );
      await expect(createRoomService.execute(validRoomRequest)).rejects.toThrow(
        'Room with this name already exists'
      );

      expect(mockRoomModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Sala A' },
      });
      expect(mockCreateRoomRepository.create).not.toHaveBeenCalled();
    });

    it('should create room successfully when name is unique', async () => {
      mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
      mockCreateRoomRepository.create = jest
        .fn()
        .mockResolvedValue(mockCreatedRoom);

      const result = await createRoomService.execute(validRoomRequest);

      expect(mockRoomModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Sala A' },
      });
      expect(mockCreateRoomRepository.create).toHaveBeenCalledWith(
        validRoomRequest
      );
      expect(result.room).toEqual(mockCreatedRoom);
    });

    it('should throw error when repository create returns null', async () => {
      mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
      mockCreateRoomRepository.create = jest.fn().mockResolvedValue(null);

      await expect(createRoomService.execute(validRoomRequest)).rejects.toThrow(
        'Failed to create room'
      );

      expect(mockRoomModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Sala A' },
      });
      expect(mockCreateRoomRepository.create).toHaveBeenCalledWith(
        validRoomRequest
      );
    });

    it('should create room with different valid data', async () => {
      const differentRoomRequest: ICreateRoomRequest = {
        name: 'Sala B',
        startTime: '09:00',
        endTime: '17:00',
        timeBlock: 60,
      };

      const differentCreatedRoom: IRoom = {
        id: 2,
        name: 'Sala B',
        startTime: '09:00',
        endTime: '17:00',
        timeBlock: 60,
      };

      mockRoomModel.findOne = jest.fn().mockResolvedValue(null);
      mockCreateRoomRepository.create = jest
        .fn()
        .mockResolvedValue(differentCreatedRoom);

      const result = await createRoomService.execute(differentRoomRequest);

      expect(mockRoomModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Sala B' },
      });
      expect(mockCreateRoomRepository.create).toHaveBeenCalledWith(
        differentRoomRequest
      );
      expect(result.room).toEqual(differentCreatedRoom);
    });
  });
});
