import { Router } from 'express';
import { ListCitiesController } from './list.controller';

const router = Router();
const listCitiesController = new ListCitiesController();

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Listar cidades
 *     tags: [Cities]
 *     description: Retorna a lista de cidades. Pode ser filtrada por estado usando o parâmetro stateId
 *     parameters:
 *       - in: query
 *         name: stateId
 *         schema:
 *           type: integer
 *         description: ID do estado (IBGE code) para filtrar cidades (opcional)
 *         example: 35
 *       - in: query
 *         name: uf
 *         schema:
 *           type: string
 *         description: "Sigla do estado (UF) para filtrar cidades (opcional). Exemplos: SP, RJ, MG"
 *         example: SP
 *     responses:
 *       200:
 *         description: Lista de cidades retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: Código IBGE da cidade
 *                         example: 3550308
 *                       name:
 *                         type: string
 *                         description: Nome da cidade
 *                         example: São Paulo
 *                       stateId:
 *                         type: number
 *                         description: ID do estado (código IBGE)
 *                         example: 35
 *                       state:
 *                         type: object
 *                         description: Dados do estado (incluído quando filtra por UF)
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 35
 *                           name:
 *                             type: string
 *                             example: São Paulo
 *                           uf:
 *                             type: string
 *                             example: SP
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Data de criação do registro
 *                         example: "2024-01-01T00:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Data de atualização do registro
 *                         example: "2024-01-01T00:00:00.000Z"
 *                 total:
 *                   type: number
 *                   description: Total de cidades retornadas
 *                   example: 645
 */
router.get('/', listCitiesController.handle);

export { router as listCitiesRoutes };
