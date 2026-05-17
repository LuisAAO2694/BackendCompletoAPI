import { body, param, query, validationResult } from 'express-validator';

export const createMessageValidation = [
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('El asunto es requerido')
        .isLength({ min: 3, max: 100 })
        .withMessage('El asunto debe tener entre 3 y 100 caracteres'),
    
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido es requerido')
        .isLength({ min: 10, max: 1000 })
        .withMessage('El contenido debe tener entre 10 y 1000 caracteres'),
    
    body('product')
        .optional()
        .isMongoId()
        .withMessage('El ID del producto no es válido')
];

export const respondMessageValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del mensaje no es válido'),
    
    body('content')
        .trim()
        .notEmpty()
        .withMessage('La respuesta es requerida')
        .isLength({ min: 1, max: 1000 })
        .withMessage('La respuesta debe tener entre 1 y 1000 caracteres')
];

export const messageIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del mensaje no es válido')
];

export const getMessagesValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero positivo'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe estar entre 1 y 100')
];

export const sendToStudentValidation = [
    body('student')
        .isMongoId()
        .withMessage('El ID del estudiante no es válido'),
    
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('El asunto es requerido')
        .isLength({ min: 3, max: 100 })
        .withMessage('El asunto debe tener entre 3 y 100 caracteres'),
    
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido es requerido')
        .isLength({ min: 10, max: 1000 })
        .withMessage('El contenido debe tener entre 10 y 1000 caracteres'),
    
    body('product')
        .optional()
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