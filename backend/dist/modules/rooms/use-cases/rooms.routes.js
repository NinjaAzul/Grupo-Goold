"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomsRoutes = void 0;
const express_1 = require("express");
const create_controller_1 = require("./create/create.controller");
const list_controller_1 = require("./list/list.controller");
const update_controller_1 = require("./update/update.controller");
const delete_controller_1 = require("./delete/delete.controller");
const middlewares_1 = require("@shared/middlewares");
const middlewares_2 = require("@shared/middlewares");
const create_dto_1 = require("./create/create.dto");
const update_dto_1 = require("./update/update.dto");
const roomsRoutes = (0, express_1.Router)();
exports.roomsRoutes = roomsRoutes;
const createRoomController = new create_controller_1.CreateRoomController();
const listRoomsController = new list_controller_1.ListRoomsController();
const updateRoomController = new update_controller_1.UpdateRoomController();
const deleteRoomController = new delete_controller_1.DeleteRoomController();
/**
 * @swagger
 * /admin/rooms:
 *   get:
 *     summary: List all rooms (Admin only)
 *     tags: [Admin - Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rooms
 *       401:
 *         description: Unauthorized
 */
roomsRoutes.get('/', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, listRoomsController.handle.bind(listRoomsController));
/**
 * @swagger
 * /admin/rooms:
 *   post:
 *     summary: Create a new room (Admin only)
 *     tags: [Admin - Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *               - timeBlock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sala 012"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "18:00"
 *               timeBlock:
 *                 type: integer
 *                 example: 30
 *                 description: Time block in minutes
 *     responses:
 *       201:
 *         description: Room created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
roomsRoutes.post('/', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_2.validationMiddleware)(create_dto_1.CreateRoomDto), createRoomController.handle.bind(createRoomController));
/**
 * @swagger
 * /admin/rooms/{id}:
 *   patch:
 *     summary: Update a room (Admin only)
 *     tags: [Admin - Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               timeBlock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Room updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sala não encontrada
 */
roomsRoutes.patch('/:id', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, (0, middlewares_2.validationMiddleware)(update_dto_1.UpdateRoomDto), updateRoomController.handle.bind(updateRoomController));
/**
 * @swagger
 * /admin/rooms/{id}:
 *   delete:
 *     summary: Delete a room (Admin only)
 *     tags: [Admin - Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       204:
 *         description: Room deleted
 *       400:
 *         description: Bad request (room has appointments)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sala não encontrada
 */
roomsRoutes.delete('/:id', middlewares_1.ensureAuthenticated, middlewares_1.ensureAdmin, deleteRoomController.handle.bind(deleteRoomController));
//# sourceMappingURL=rooms.routes.js.map