import { Router } from 'express';
import productsController from '../controllers/products.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { 
    createProductValidation, 
    updateProductValidation, 
    getProductsValidation, 
    productIdValidation, 
    validate 
} from '../validators/products.validator.js';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar equipos con filtros y paginación
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [disponible, prestado, mantenimiento]
 *         description: Filtrar por estado
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre
 *       - in: query
 *         name: laboratory
 *         schema:
 *           type: string
 *         description: Filtrar por laboratorio
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de equipos
 */
router.get('/', getProductsValidation, validate, productsController.getAll);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Obtener todas las categorías únicas
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/categories', productsController.getCategories);

/**
 * @swagger
 * /api/products/laboratories:
 *   get:
 *     summary: Obtener todos los laboratorios únicos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de laboratorios
 */
router.get('/laboratories', productsController.getLaboratories);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener detalle de un equipo
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del equipo
 *       404:
 *         description: Equipo no encontrado
 */
router.get('/:id', productIdValidation, validate, productsController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo equipo
 *     tags: [Products]
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
 *               - category
 *               - laboratory
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               laboratory: { type: string }
 *               serialNumber: { type: string }
 *               status: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Equipo creado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', authMiddleware, roleMiddleware('encargado'), createProductValidation, validate, productsController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un equipo
 *     tags: [Products]
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
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               laboratory: { type: string }
 *               serialNumber: { type: string }
 *               status: { type: string }
 *               image: { type: string }
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *       404:
 *         description: Equipo no encontrado
 */
router.put('/:id', authMiddleware, roleMiddleware('encargado'), updateProductValidation, validate, productsController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un equipo
 *     tags: [Products]
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
 *         description: Equipo eliminado
 *       404:
 *         description: Equipo no encontrado
 */
router.delete('/:id', authMiddleware, roleMiddleware('encargado'), productIdValidation, validate, productsController.remove);

export default router;
