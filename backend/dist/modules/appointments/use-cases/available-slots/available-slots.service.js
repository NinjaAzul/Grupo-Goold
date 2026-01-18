"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableSlotsService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const sequelize_1 = require("sequelize");
const date_helper_1 = require("@shared/utils/date.helper");
class AvailableSlotsService {
    constructor() {
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    async calculateSlotsForRoom(room, date) {
        const timeBlock = room.timeBlock;
        const MINIMUM_APPOINTMENT_DURATION = 60;
        const [startHour, startMinute] = room.startTime.split(':');
        const [endHour, endMinute] = room.endTime.split(':');
        const [year, month, day] = date.split('-');
        const startDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(startHour), parseInt(startMinute), 0, 0));
        const endDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(endHour), parseInt(endMinute), 0, 0));
        const dayStartUTC = date_helper_1.DateHelper.getStartOfDayUTC(date);
        const dayEndUTC = date_helper_1.DateHelper.getEndOfDayUTC(date);
        const existingAppointments = await appointment_model_1.AppointmentModel.findAll({
            where: {
                room: room.name,
                appointmentDate: {
                    [sequelize_1.Op.between]: [dayStartUTC, dayEndUTC],
                },
                status: {
                    [sequelize_1.Op.in]: ['pending', 'scheduled'],
                },
            },
            order: [['appointmentDate', 'ASC']],
        });
        const occupiedIntervals = existingAppointments.map((apt) => {
            let aptDate;
            if (apt.appointmentDate instanceof Date) {
                aptDate = apt.appointmentDate;
            }
            else {
                aptDate = date_helper_1.DateHelper.fromISOString(String(apt.appointmentDate));
            }
            const aptStart = date_helper_1.DateHelper.createUTCDate(aptDate.getUTCFullYear(), aptDate.getUTCMonth() + 1, aptDate.getUTCDate(), aptDate.getUTCHours(), aptDate.getUTCMinutes());
            const aptEnd = date_helper_1.DateHelper.addHoursUTC(aptStart, 1);
            return {
                start: aptStart,
                end: aptEnd,
            };
        });
        const allSlots = [];
        let currentTime = new Date(startDate);
        while (currentTime < endDate) {
            const slotStart = new Date(currentTime);
            slotStart.setUTCSeconds(0, 0);
            slotStart.setUTCMilliseconds(0);
            const slotEnd = date_helper_1.DateHelper.addMinutesUTC(slotStart, MINIMUM_APPOINTMENT_DURATION);
            if (slotEnd > endDate) {
                break;
            }
            const slotTime = date_helper_1.DateHelper.extractTimeOnly(slotStart);
            const hasConflict = occupiedIntervals.some((interval) => {
                const slotStartTime = slotStart.getTime();
                const slotEndTime = slotEnd.getTime();
                const intervalStartTime = interval.start.getTime();
                const intervalEndTime = interval.end.getTime();
                const overlaps = (slotStartTime >= intervalStartTime &&
                    slotStartTime < intervalEndTime) ||
                    (slotEndTime > intervalStartTime && slotEndTime <= intervalEndTime) ||
                    (slotStartTime <= intervalStartTime &&
                        slotEndTime >= intervalEndTime) ||
                    (slotStartTime > intervalStartTime && slotEndTime < intervalEndTime);
                return overlaps;
            });
            if (!hasConflict) {
                allSlots.push(slotTime);
            }
            currentTime = date_helper_1.DateHelper.addMinutesUTC(currentTime, timeBlock);
        }
        return allSlots;
    }
    async execute(request) {
        const requestDate = new Date(request.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (requestDate < today) {
            return { slots: [] };
        }
        const rooms = await this.appointmentRepository.getRooms(request.roomId);
        if (rooms.length === 0) {
            return { slots: [] };
        }
        const availableSlots = [];
        for (const room of rooms) {
            const slots = await this.calculateSlotsForRoom(room, request.date);
            availableSlots.push(...slots);
        }
        return { slots: [...new Set(availableSlots)].sort() };
    }
}
exports.AvailableSlotsService = AvailableSlotsService;
//# sourceMappingURL=available-slots.service.js.map