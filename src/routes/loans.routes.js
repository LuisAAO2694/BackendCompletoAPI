import { Router } from 'express';
import loansController from '../controllers/loans.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Listar todos los préstamos (admin)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [activo, entregado]
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
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
 *         description: Lista de préstamos
 */
router.get('/', authMiddleware, roleMiddleware('admin'), loansController.getAll);

/**
 * @swagger
 * /api/loans/activos:
 *   get:
 *     summary: Listar préstamos activos (admin)
 *     tags: [Loans]
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
 *         description: Lista de préstamos activos
 */
router.get('/activos', authMiddleware, roleMiddleware('admin'), loansController.getActive);

/**
 * @swagger
 * /api/loans/mios:
 *   get:
 *     summary: Ver mis préstamos (usuario autenticado)
 *     tags: [Loans]
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
 *         description: Lista de mis préstamos
 */
router.get('/mios', authMiddleware, loansController.getMine);

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Ver detalle de un préstamo
 *     tags: [Loans]
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
 *         description: Detalle del préstamo
 *       404:
 *         description: Préstamo no encontrado
 */
router.get('/:id', authMiddleware, loansController.getById);

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Registrar nuevo préstamo (admin)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - product
 *               - estimatedReturnDate
 *             properties:
 *               user: { type: string }
 *               product: { type: string }
 *               estimatedReturnDate: { type: string, format: date-time }
 *               observations: { type: string }
 *     responses:
 *       201:
 *         description: Préstamo creado
 */
router.post('/', authMiddleware, roleMiddleware('admin'), loansController.create);

/**
 * @swagger
 * /api/loans/{id}/estatus:
 *   patch:
 *     summary: Marcar préstamo como entregado (admin)
 *     tags: [Loans]
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
 *               - status
 *             properties:
 *               status: { type: string, enum: [entregado] }
 *     responses:
 *       200:
 *         description: Préstamo actualizado
 */
router.patch('/:id/estatus', authMiddleware, roleMiddleware('admin'), loansController.updateStatus);

export default router;
