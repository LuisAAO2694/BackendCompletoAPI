import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos los usuarios (encargado)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [estudiante, encargado]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', authMiddleware, roleMiddleware('encargado'), usersController.getAll);

/**
 * @swagger
 * /api/users/perfil:
 *   get:
 *     summary: Ver perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 */
router.get('/perfil', authMiddleware, usersController.getProfile);

export default router;
