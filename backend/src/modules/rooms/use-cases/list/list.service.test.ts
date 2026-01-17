import { ListRoomsService } from './list.service';
import { ListRoomsRepository } from './list.repository';
import { IRoom } from '@modules/rooms/model/room.interface';

// Mocks
jest.mock('./list.repository');

describe('ListRoomsService', () => {
  let listRoomsService: ListRoomsService;
  let mockListRoomsRepository: jest.Mocked<ListRoomsRepository>;

  beforeEach(() => {
    mockListRoomsRepository =
      new ListRoomsRepository() as jest.Mocked<ListRoomsRepository>;
    listRoomsService = new ListRoomsService();
    (
      listRoomsService as unknown as { repository: ListRoomsRepository }
    ).repository = mockListRoomsRepository;
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
      mockListRoomsRepository.findAll = jest
        .fn()
        .mockResolvedValue(mockRooms as IRoom[]);

      const result = await listRoomsService.execute();

      expect(mockListRoomsRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRooms);
    });

    it('should handle empty results', async () => {
      mockListRoomsRepository.findAll = jest.fn().mockResolvedValue([]);

      const result = await listRoomsService.execute();

      expect(result).toEqual([]);
    });
  });
});
