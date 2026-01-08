import { Router } from 'express';
import { CreateRoomController } from './create/create.controller';
import { ListRoomsController } from './list/list.controller';
import { UpdateRoomController } from './update/update.controller';
import { DeleteRoomController } from './delete/delete.controller';
import { ensureAuthenticated, ensureAdmin } from '@shared/middlewares';
import { validationMiddleware } from '@shared/middlewares';
import { CreateRoomDto } from './create/create.dto';
import { UpdateRoomDto } from './update/update.dto';

const roomsRoutes = Router();

const createRoomController = new CreateRoomController();
const listRoomsController = new ListRoomsController();
const updateRoomController = new UpdateRoomController();
const deleteRoomController = new DeleteRoomController();

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
roomsRoutes.get(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  listRoomsController.handle.bind(listRoomsController)
);

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
roomsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  validationMiddleware(CreateRoomDto),
  createRoomController.handle.bind(createRoomController)
);

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
 *         description: Room not found
 */
roomsRoutes.patch(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  validationMiddleware(UpdateRoomDto),
  updateRoomController.handle.bind(updateRoomController)
);

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
 *         description: Room not found
 */
roomsRoutes.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  deleteRoomController.handle.bind(deleteRoomController)
);

export { roomsRoutes };
