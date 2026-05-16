import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { registerValidation, loginValidation, validate } from '../validators/auth.validator.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [estudiante, encargado] }
 *               studentId: { type: string }
 *               career: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Error de validación o email ya registrado
 */
router.post('/register', registerValidation, validate, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginValidation, validate, authController.login);

export default router;
