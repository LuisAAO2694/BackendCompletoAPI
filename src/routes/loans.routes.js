import { Router } from 'express';
import loansController from '../controllers/loans.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import {
    createLoanValidation,
    approveLoanValidation,
    rejectLoanValidation,
    deliverLoanValidation,
    cancelLoanValidation,
    devolutionsValidation,
    getLoansValidation,
    getMyLoansValidation,
    loanIdValidation,
    validate
} from '../validators/loans.validator.js';

const router = Router();

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Listar todos los préstamos (encargado)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDIENTE_APROBACION, APROBADO, ACTIVO, RECHAZADO, CANCELADO, FINALIZADO, PARCIALMENTE_DEVUELTO]
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
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
router.get('/', authMiddleware, roleMiddleware('encargado'), getLoansValidation, validate, loansController.getAll);

/**
 * @swagger
 * /api/loans/mis-prestamos:
 *   get:
 *     summary: Ver mis préstamos (estudiante)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [activos, historial, all]
 *           default: all
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
router.get('/mis-prestamos', authMiddleware, getMyLoansValidation, validate, loansController.getMyLoans);

/**
 * @swagger
 * /api/loans/no-devueltos:
 *   get:
 *     summary: Ver préstamos con equipos no devueltos (encargado)
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
 *         description: Lista de préstamos con equipos no devueltos
 */
router.get('/no-devueltos', authMiddleware, roleMiddleware('encargado'), loansController.getNotReturned);

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
router.get('/:id', authMiddleware, loanIdValidation, validate, loansController.getById);

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Registrar nuevo préstamo (estudiante)
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
 *               - equipment
 *               - estimatedReturnDate
 *             properties:
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: object
*                   properties:
*                     product: { type: string }
*                     observations: { type: string }
*               estimatedReturnDate: { type: string, format: date-time }
*               notes: { type: string }
 *     responses:
 *       201:
 *         description: Préstamo creado
 *       400:
 *         description: Equipo no disponible
 */
router.post('/', authMiddleware, roleMiddleware('estudiante'), createLoanValidation, validate, loansController.create);

/**
 * @swagger
 * /api/loans/{id}/aprobar:
 *   patch:
 *     summary: Aprobar préstamo (encargado)
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observaciones: { type: string }
 *     responses:
 *       200:
 *         description: Préstamo aprobado
 */
router.patch('/:id/aprobar', authMiddleware, roleMiddleware('encargado'), approveLoanValidation, validate, loansController.approve);

/**
 * @swagger
 * /api/loans/{id}/rechazar:
 *   patch:
 *     summary: Rechazar préstamo (encargado)
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
 *               - razon
 *             properties:
 *               razon: { type: string }
 *     responses:
 *       200:
 *         description: Préstamo rechazado
 */
router.patch('/:id/rechazar', authMiddleware, roleMiddleware('encargado'), rejectLoanValidation, validate, loansController.reject);

/**
 * @swagger
 * /api/loans/{id}/entregar:
 *   patch:
 *     summary: Entregar préstamo aprobado (encargado)
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observaciones: { type: string }
 *     responses:
 *       200:
 *         description: Préstamo entregado (estado ACTIVO)
 *       400:
 *         description: El préstamo no está en estado APROBADO
 */
router.patch('/:id/entregar', authMiddleware, roleMiddleware('encargado'), deliverLoanValidation, validate, loansController.deliver);

/**
 * @swagger
 * /api/loans/{id}/cancelar:
 *   patch:
 *     summary: Cancelar préstamo (estudiante)
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
 *         description: Préstamo cancelado
 *       400:
 *         description: Solo se puede cancelar en estado PENDIENTE_APROBACION
 */
router.patch('/:id/cancelar', authMiddleware, roleMiddleware('estudiante'), cancelLoanValidation, validate, loansController.cancel);

/**
 * @swagger
 * /api/loans/{id}/devoluciones:
 *   post:
 *     summary: Registrar devoluciones de equipos (encargado)
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
 *               - devoluciones
 *             properties:
 *               devoluciones:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     equipo_id: { type: string }
 *                     estadoDevolucion:
 *                       type: string
 *                       enum: [DEVUELTO, DEVUELTO_DAÑADO, NO_DEVUELTO]
 *                     observaciones: { type: string }
 *     responses:
 *       200:
 *         description: Devoluciones procesadas
 */
router.post('/:id/devoluciones', authMiddleware, roleMiddleware('encargado'), devolutionsValidation, validate, loansController.devolutions);

export default router;