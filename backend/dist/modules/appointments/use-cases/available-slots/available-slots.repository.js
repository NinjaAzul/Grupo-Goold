"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableSlotsRepository = void 0;
const appointment_model_1 = require("@modules/appointments/model/appointment.model");
const room_model_1 = require("@modules/rooms/model/room.model");
const sequelize_1 = require("sequelize");
const date_helper_1 = require("@shared/utils/date.helper");
class AvailableSlotsRepository {
    async getAvailableSlots(request) {
        const roomsWhere = {};
        if (request.roomId) {
            roomsWhere.id = request.roomId;
        }
        const rooms = await room_model_1.RoomModel.findAll({
            where: roomsWhere,
        });
        if (rooms.length === 0) {
            return [];
        }
        const availableSlots = [];
        for (const room of rooms) {
            const slots = await this.calculateSlotsForRoom(room, request.date);
            availableSlots.push(...slots);
        }
        return [...new Set(availableSlots)].sort();
    }
    async calculateSlotsForRoom(room, date) {
        const timeBlock = room.timeBlock;
        const MINIMUM_APPOINTMENT_DURATION = 60;
        // Criar datas em UTC para consistência total
        // Formato: YYYY-MM-DDTHH:mm:ssZ (UTC)
        const [startHour, startMinute] = room.startTime.split(':');
        const [endHour, endMinute] = room.endTime.split(':');
        const [year, month, day] = date.split('-');
        const startDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(startHour), parseInt(startMinute), 0, 0));
        const endDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(endHour), parseInt(endMinute), 0, 0));
        // Buscar agendamentos já existentes para esta sala e data
        // Criar range do dia inteiro para garantir que pegamos todos os agendamentos
        // Usar UTC para evitar problemas de timezone na query
        const dayStartUTC = new Date(`${date}T00:00:00.000Z`);
        const dayEndUTC = new Date(`${date}T23:59:59.999Z`);
        console.log(`[AvailableSlots] Sala: ${room.name}, Data: ${date}`);
        console.log(`[AvailableSlots] Buscando agendamentos entre: ${dayStartUTC.toISOString()} e ${dayEndUTC.toISOString()}`);
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
        // Log temporário para debug
        console.log(`[AvailableSlots] Agendamentos encontrados: ${existingAppointments.length}`);
        existingAppointments.forEach((apt) => {
            const rawDate = apt.appointmentDate instanceof Date
                ? apt.appointmentDate
                : new Date(apt.appointmentDate);
            console.log(`[AvailableSlots] - ID: ${apt.id}, Data (raw): ${apt.appointmentDate}, Data (ISO): ${rawDate.toISOString()}, Data (Local): ${rawDate.toString()}, Status: ${apt.status}, Sala: ${apt.room}`);
        });
        // Criar array de intervalos ocupados (cada agendamento ocupa 1 hora)
        // Trabalhar sempre com UTC/ISO para evitar problemas de timezone
        const occupiedIntervals = existingAppointments.map((apt) => {
            // Converter a data do banco para Date object (já está em UTC)
            let aptDate;
            if (apt.appointmentDate instanceof Date) {
                aptDate = apt.appointmentDate;
            }
            else {
                aptDate = date_helper_1.DateHelper.fromISOString(String(apt.appointmentDate));
            }
            // Criar data em UTC mantendo os componentes UTC usando o helper
            const aptStart = date_helper_1.DateHelper.createUTCDate(aptDate.getUTCFullYear(), aptDate.getUTCMonth() + 1, // getUTCMonth retorna 0-11, helper espera 1-12
            aptDate.getUTCDate(), aptDate.getUTCHours(), aptDate.getUTCMinutes());
            // Adicionar 1 hora em UTC usando o helper
            const aptEnd = date_helper_1.DateHelper.addHoursUTC(aptStart, 1);
            const aptTime = `${aptStart.getUTCHours().toString().padStart(2, '0')}:${aptStart.getUTCMinutes().toString().padStart(2, '0')}`;
            console.log(`[AvailableSlots] Intervalo ocupado: ${aptTime} (${aptStart.toISOString()} até ${aptEnd.toISOString()})`);
            console.log(`[AvailableSlots] Intervalo ocupado (getTime): ${aptStart.getTime()} até ${aptEnd.getTime()}`);
            return {
                start: aptStart,
                end: aptEnd,
            };
        });
        const allSlots = [];
        let currentTime = new Date(startDate);
        while (currentTime < endDate) {
            const slotStart = new Date(currentTime);
            // Zerar segundos e milissegundos para comparação precisa (em UTC)
            slotStart.setUTCSeconds(0, 0);
            slotStart.setUTCMilliseconds(0);
            // Adicionar duração mínima usando o helper
            const slotEnd = date_helper_1.DateHelper.addMinutesUTC(slotStart, MINIMUM_APPOINTMENT_DURATION);
            if (slotEnd > endDate) {
                break;
            }
            // Extrair hora usando o helper
            const slotTime = date_helper_1.DateHelper.extractTimeOnly(slotStart);
            // Verificar se há conflito com agendamentos existentes
            // Comparar usando getTime() para precisão de milissegundos
            const hasConflict = occupiedIntervals.some((interval) => {
                const slotStartTime = slotStart.getTime();
                const slotEndTime = slotEnd.getTime();
                const intervalStartTime = interval.start.getTime();
                const intervalEndTime = interval.end.getTime();
                // Log detalhado para o slot 12:11
                if (slotTime === '12:11') {
                    console.log(`[AvailableSlots] 🔍 Verificando slot 12:11:`);
                    console.log(`  Slot: ${slotStartTime} até ${slotEndTime}`);
                    console.log(`  Intervalo: ${intervalStartTime} até ${intervalEndTime}`);
                    console.log(`  Slot ISO: ${slotStart.toISOString()} até ${slotEnd.toISOString()}`);
                    console.log(`  Intervalo ISO: ${interval.start.toISOString()} até ${interval.end.toISOString()}`);
                }
                // Conflito se os intervalos se sobrepõem de qualquer forma
                // Verificar todas as possibilidades de sobreposição
                const overlaps = (slotStartTime >= intervalStartTime &&
                    slotStartTime < intervalEndTime) ||
                    (slotEndTime > intervalStartTime && slotEndTime <= intervalEndTime) ||
                    (slotStartTime <= intervalStartTime &&
                        slotEndTime >= intervalEndTime) ||
                    (slotStartTime > intervalStartTime && slotEndTime < intervalEndTime);
                if (slotTime === '12:11' && overlaps) {
                    console.log(`[AvailableSlots] ✅ CONFLITO DETECTADO para 12:11!`);
                }
                return overlaps;
            });
            if (!hasConflict) {
                allSlots.push(slotTime);
            }
            else {
                console.log(`[AvailableSlots] ❌ Slot ${slotTime} REMOVIDO por conflito`);
            }
            // Avançar pelo timeBlock em UTC usando o helper
            currentTime = date_helper_1.DateHelper.addMinutesUTC(currentTime, timeBlock);
        }
        console.log(`[AvailableSlots] Slots disponíveis finais: ${allSlots.join(', ')}`);
        return allSlots;
    }
}
exports.AvailableSlotsRepository = AvailableSlotsRepository;
//# sourceMappingURL=available-slots.repository.js.map