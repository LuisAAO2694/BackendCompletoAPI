import { body, param, query, validationResult } from 'express-validator';

export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre del equipo es requerido'),
    
    body('category')
        .trim()
        .notEmpty()
        .withMessage('La categoría es requerida'),
    
    body('laboratory')
        .trim()
        .notEmpty()
        .withMessage('El laboratorio es requerido'),
    
    body('description')
        .optional()
        .trim(),
    
    body('serialNumber')
        .optional()
        .trim(),
    
    body('status')
        .optional()
        .isIn(['disponible', 'prestado', 'mantenimiento'])
        .withMessage('El estado debe ser: disponible, prestado o mantenimiento'),
    
    body('image')
        .optional()
        .trim()
];

export const updateProductValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    
    body('category')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('La categoría no puede estar vacía'),
    
    body('laboratory')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El laboratorio no puede estar vacío'),
    
    body('description')
        .optional()
        .trim(),
    
    body('serialNumber')
        .optional()
        .trim(),
    
    body('status')
        .optional()
        .isIn(['disponible', 'prestado', 'mantenimiento'])
        .withMessage('El estado debe ser: disponible, prestado o mantenimiento'),
    
    body('image')
        .optional()
        .trim()
];

export const getProductsValidation = [
    query('category')
        .optional()
        .trim(),
    
    query('status')
        .optional()
        .isIn(['disponible', 'prestado', 'mantenimiento'])
        .withMessage('El estado debe ser: disponible, prestado o mantenimiento'),
    
    query('search')
        .optional()
        .trim(),
    
    query('laboratory')
        .optional()
        .trim(),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero positivo'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe estar entre 1 y 100')
];

export const productIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del producto no es válido')
];

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Error de validación',
            errors: errors.array() 
        });
    }
    next();
};