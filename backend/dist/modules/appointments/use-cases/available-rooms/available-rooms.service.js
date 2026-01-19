"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableRoomsService = void 0;
const appointment_repository_1 = require("../../repositories/appointment.repository");
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const sequelize_1 = require("sequelize");
const date_helper_1 = require("@shared/utils/date.helper");
class AvailableRoomsService {
    constructor() {
        this.MINIMUM_APPOINTMENT_DURATION = 60; // 60 minutos (1 hora)
        this.appointmentRepository = new appointment_repository_1.AppointmentRepository();
    }
    isTimeInRange(time, startTime, endTime) {
        const [timeHour, timeMinute] = time.split(':').map(Number);
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const timeMinutes = timeHour * 60 + timeMinute;
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        // Verificar se o horário inicial está dentro do range
        if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
            return false;
        }
        // Verificar se o horário final (time + 60min) também está dentro do range
        const timeEndMinutes = timeMinutes + this.MINIMUM_APPOINTMENT_DURATION;
        return timeEndMinutes <= endMinutes;
    }
    async hasConflict(room, date, time) {
        const [year, month, day] = date.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);
        const requestedStart = date_helper_1.DateHelper.createUTCDate(year, month, day, hour, minute);
        const requestedEnd = date_helper_1.DateHelper.addMinutesUTC(requestedStart, this.MINIMUM_APPOINTMENT_DURATION);
        const dayStartUTC = date_helper_1.DateHelper.getStartOfDayUTC(date);
        const dayEndUTC = date_helper_1.DateHelper.getEndOfDayUTC(date);
        const existingAppointments = await appointment_model_1.AppointmentModel.findAll({
            where: {
                roomId: room.id,
                appointmentDate: {
                    [sequelize_1.Op.between]: [dayStartUTC, dayEndUTC],
                },
                status: {
                    [sequelize_1.Op.in]: ['pending', 'scheduled'],
                },
            },
        });
        for (const apt of existingAppointments) {
            let aptDate;
            if (apt.appointmentDate instanceof Date) {
                aptDate = apt.appointmentDate;
            }
            else {
                aptDate = date_helper_1.DateHelper.fromISOString(String(apt.appointmentDate));
            }
            const aptStart = date_helper_1.DateHelper.createUTCDate(aptDate.getUTCFullYear(), aptDate.getUTCMonth() + 1, aptDate.getUTCDate(), aptDate.getUTCHours(), aptDate.getUTCMinutes());
            const aptEnd = date_helper_1.DateHelper.addHoursUTC(aptStart, 1);
            const requestedStartTime = requestedStart.getTime();
            const requestedEndTime = requestedEnd.getTime();
            const aptStartTime = aptStart.getTime();
            const aptEndTime = aptEnd.getTime();
            const overlaps = (requestedStartTime >= aptStartTime &&
                requestedStartTime < aptEndTime) ||
                (requestedEndTime > aptStartTime && requestedEndTime <= aptEndTime) ||
                (requestedStartTime <= aptStartTime &&
                    requestedEndTime >= aptEndTime) ||
                (requestedStartTime > aptStartTime && requestedEndTime < aptEndTime);
            if (overlaps) {
                return true;
            }
        }
        return false;
    }
    async execute(request) {
        const [year, month, day] = request.date.split('-').map(Number);
        const [hour, minute] = request.time.split(':').map(Number);
        const requestedDateTime = date_helper_1.DateHelper.createUTCDate(year, month, day, hour, minute);
        const now = new Date();
        if (requestedDateTime < now) {
            return { rooms: [] };
        }
        const allRooms = await this.appointmentRepository.getRooms();
        const availableRooms = [];
        for (const room of allRooms) {
            if (!this.isTimeInRange(request.time, room.startTime, room.endTime)) {
                continue;
            }
            const conflict = await this.hasConflict(room, request.date, request.time);
            if (!conflict) {
                availableRooms.push(room.toJSON());
            }
        }
        return { rooms: availableRooms };
    }
}
exports.AvailableRoomsService = AvailableRoomsService;
//# sourceMappingURL=available-rooms.service.js.map