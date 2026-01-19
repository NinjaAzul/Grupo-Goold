"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_list_service_1 = require("./admin-list.service");
const appointment_repository_1 = require("../../repositories/appointment.repository");
// Mocks
jest.mock('../../repositories/appointment.repository');
describe('AdminListAppointmentsService', () => {
    let adminListAppointmentsService;
    let mockAppointmentRepository;
    beforeEach(() => {
        mockAppointmentRepository =
            new appointment_repository_1.AppointmentRepository();
        adminListAppointmentsService = new admin_list_service_1.AdminListAppointmentsService();
        adminListAppointmentsService.appointmentRepository = mockAppointmentRepository;
        jest.clearAllMocks();
    });
    describe('execute', () => {
        const mockAppointments = [
            {
                id: 1,
                userId: 1,
                appointmentDate: new Date('2024-01-20T10:00:00Z'),
                roomId: 1,
            },
            {
                id: 2,
                userId: 2,
                appointmentDate: new Date('2024-01-21T14:00:00Z'),
                roomId: 2,
            },
        ];
        it('should return paginated appointments with default values', async () => {
            mockAppointmentRepository.findAllAdmin = jest.fn().mockResolvedValue({
                appointments: mockAppointments,
                total: 2,
            });
            const result = await adminListAppointmentsService.execute({});
            expect(mockAppointmentRepository.findAllAdmin).toHaveBeenCalledWith({});
            expect(result.success).toBe(true);
            expect(result.data).toEqual([
                {
                    ...mockAppointments[0],
                    appointmentDate: '2024-01-20T10:00:00.000Z',
                },
                {
                    ...mockAppointments[1],
                    appointmentDate: '2024-01-21T14:00:00.000Z',
                },
            ]);
            expect(result.pagination?.page).toBe(1);
            expect(result.pagination?.limit).toBe(10);
            expect(result.pagination?.total).toBe(2);
            expect(result.pagination?.totalPages).toBe(1);
        });
        it('should return paginated appointments with custom filters', async () => {
            mockAppointmentRepository.findAllAdmin = jest.fn().mockResolvedValue({
                appointments: [mockAppointments[0]],
                total: 1,
            });
            const result = await adminListAppointmentsService.execute({
                page: 1,
                limit: 5,
                name: 'John',
                room: 'Sala A',
                status: 'scheduled',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });
            expect(mockAppointmentRepository.findAllAdmin).toHaveBeenCalledWith({
                page: 1,
                limit: 5,
                name: 'John',
                room: 'Sala A',
                status: 'scheduled',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });
            expect(result.pagination?.page).toBe(1);
            expect(result.pagination?.limit).toBe(5);
            expect(result.pagination?.total).toBe(1);
            expect(result.pagination?.totalPages).toBe(1);
        });
        it('should handle empty results', async () => {
            mockAppointmentRepository.findAllAdmin = jest.fn().mockResolvedValue({
                appointments: [],
                total: 0,
            });
            const result = await adminListAppointmentsService.execute({});
            expect(result.data).toEqual([]);
            expect(result.pagination?.total).toBe(0);
            expect(result.pagination?.totalPages).toBe(0);
        });
    });
});
//# sourceMappingURL=admin-list.service.test.js.map