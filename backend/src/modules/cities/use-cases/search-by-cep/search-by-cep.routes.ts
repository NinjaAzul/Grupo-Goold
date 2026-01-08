import { Router } from 'express';
import { SearchByCEPController } from './search-by-cep.controller';

const router = Router();
const searchByCEPController = new SearchByCEPController();

/**
 * @swagger
 * /cities/search/cep/{cep}:
 *   get:
 *     summary: Buscar endereço por CEP
 *     tags: [Cities]
 *     description: Busca o endereço completo (rua, bairro, cidade, estado) através do CEP usando a API ViaCEP e retorna os dados da cidade e estado do banco de dados
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *         description: CEP no formato 00000-000 ou 00000000
 *         example: "01310-100"
 *     responses:
 *       200:
 *         description: Endereço encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cep:
 *                   type: string
 *                   example: "01310-100"
 *                 street:
 *                   type: string
 *                   example: "Avenida Paulista"
 *                 complement:
 *                   type: string
 *                   example: ""
 *                 neighborhood:
 *                   type: string
 *                   example: "Bela Vista"
 *                 city:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 3550308
 *                     name:
 *                       type: string
 *                       example: São Paulo
 *                     stateId:
 *                       type: number
 *                       example: 35
 *                 state:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 35
 *                     name:
 *                       type: string
 *                       example: São Paulo
 *                     uf:
 *                       type: string
 *                       example: SP
 *       404:
 *         description: CEP não encontrado ou cidade/estado não encontrados no banco
 */
router.get('/search/cep/:cep', searchByCEPController.handle);

export { router as searchByCEPRoutes };
