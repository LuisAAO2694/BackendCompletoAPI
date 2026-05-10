import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

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
