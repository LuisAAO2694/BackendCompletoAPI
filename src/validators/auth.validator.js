import { body, validationResult } from 'express-validator';

export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es requerido')
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    
    body('role')
        .optional()
        .isIn(['estudiante', 'encargado'])
        .withMessage('El rol debe ser estudiante o encargado'),
    
    body('studentId')
        .optional()
        .trim(),
    
    body('career')
        .optional()
        .trim(),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^\d{10}$/)
        .withMessage('El teléfono debe tener 10 dígitos')
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es requerido')
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
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