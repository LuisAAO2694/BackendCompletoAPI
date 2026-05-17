import { Router } from 'express';
import messagesController from '../controllers/messages.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import {
    createMessageValidation,
    respondMessageValidation,
    messageIdValidation,
    getMessagesValidation,
    sendToStudentValidation,
    validate
} from '../validators/messages.validator.js';

const router = Router();

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Ver todos los mensajes recibidos (admin)
 *     tags: [Messages]
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
 *     responses:
 *       200:
 *         description: Lista de mensajes
 */
router.get('/', authMiddleware, roleMiddleware('encargado'), getMessagesValidation, validate, messagesController.getAll);

/**
 * @swagger
 * /api/messages/mios:
 *   get:
 *     summary: Ver mis mensajes enviados (usuario)
 *     tags: [Messages]
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
 *     responses:
 *       200:
 *         description: Lista de mis mensajes
 */
router.get('/mios', authMiddleware, messagesController.getMine);

router.get('/from-manager', authMiddleware, messagesController.getFromManager);

router.delete('/:id', authMiddleware, messagesController.deleteMessage);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Enviar mensaje al encargado (usuario)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - content
 *             properties:
 *               product: { type: string }
 *               subject: { type: string }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Mensaje enviado
 */
router.post('/', authMiddleware, createMessageValidation, validate, messagesController.create);

/**
 * @swagger
 * /api/messages/{id}/responder:
 *   patch:
 *     summary: Responder un mensaje (admin)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: Mensaje respondido
 */
router.patch('/:id/responder', authMiddleware, roleMiddleware('encargado'), respondMessageValidation, validate, messagesController.respond);

/**
 * @swagger
 * /api/messages/{id}/leido:
 *   patch:
 *     summary: Marcar mensaje como leído (admin)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensaje marcado como leído
 */
router.patch('/:id/leido', authMiddleware, roleMiddleware('encargado'), messageIdValidation, validate, messagesController.markAsRead);

/**
 * @swagger
 * /api/messages/to-student:
 *   post:
 *     summary: Enviar mensaje a estudiante (encargado)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student
 *               - subject
 *               - content
 *             properties:
 *               student: { type: string }
 *               product: { type: string }
 *               subject: { type: string }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Mensaje enviado al estudiante
 */
router.post('/to-student', authMiddleware, roleMiddleware('encargado'), sendToStudentValidation, validate, messagesController.sendToStudent);

export default router;
