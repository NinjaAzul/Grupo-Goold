"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoomService = void 0;
const room_repository_1 = require("../../repositories/room.repository");
const errors_1 = require("@shared/errors");
class DeleteRoomService {
    constructor() {
        this.roomRepository = new room_repository_1.RoomRepository();
    }
    async execute(roomId) {
        const room = await this.roomRepository.findById(roomId);
        if (!room) {
            throw new errors_1.NotFoundError('Sala não encontrada');
        }
        const appointmentsCount = await this.roomRepository.countAppointmentsByRoomName(room.name);
        if (appointmentsCount > 0) {
            throw new errors_1.BadRequestError(`Não é possível excluir a sala. Existem ${appointmentsCount} agendamento(s) associados a esta sala.`);
        }
        await this.roomRepository.delete(roomId);
    }
}
exports.DeleteRoomService = DeleteRoomService;
//# sourceMappingURL=delete.service.js.map