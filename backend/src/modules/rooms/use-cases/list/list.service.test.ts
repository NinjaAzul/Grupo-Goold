import { ListRoomsService } from './list.service';
import { RoomRepository } from '../../repositories/room.repository';
import { IRoom } from '@modules/rooms/model/room.interface';

// Mocks
jest.mock('../../repositories/room.repository');

describe('ListRoomsService', () => {
  let listRoomsService: ListRoomsService;
  let mockRoomRepository: jest.Mocked<RoomRepository>;

  beforeEach(() => {
    mockRoomRepository = new RoomRepository() as jest.Mocked<RoomRepository>;
    listRoomsService = new ListRoomsService();
    (
      listRoomsService as unknown as { roomRepository: RoomRepository }
    ).roomRepository = mockRoomRepository;
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockRooms: Partial<IRoom>[] = [
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
        .mockResolvedValue(mockRooms as IRoom[]);

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
