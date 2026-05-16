import { body, param, query, validationResult } from 'express-validator';

export const createLoanValidation = [
    body('equipment')
        .isArray({ min: 1 })
        .withMessage('Debe incluir al menos un equipo'),
    
    body('equipment.*.product')
        .notEmpty()
        .withMessage('El ID del producto es requerido')
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    
    body('equipment.*.observations')
        .optional()
        .trim(),
    
    body('estimatedReturnDate')
        .notEmpty()
        .withMessage('La fecha de devolución estimada es requerida')
        .isISO8601()
        .withMessage('La fecha debe ser formato válido')
        .custom(value => {
            const inputDate = new Date(value);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            if (inputDate < tomorrow) {
                throw new Error('La fecha debe ser al menos mañana');
            }
            return true;
        }),
    
    body('notes')
        .optional()
        .trim()
];

export const approveLoanValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del préstamo no es válido'),
    
    body('observaciones')
        .optional()
        .trim()
];

export const rejectLoanValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del préstamo no es válido'),
    
    body('razon')
        .trim()
        .notEmpty()
        .withMessage('La razón del rechazo es requerida')
];

export const deliverLoanValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del préstamo no es válido'),
    
    body('observaciones')
        .optional()
        .trim()
];

export const cancelLoanValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del préstamo no es válido')
];

export const devolutionsValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del préstamo no es válido'),
    
    body('devoluciones')
        .isArray({ min: 1 })
        .withMessage('Debe incluir al menos una devolución'),
    
    body('devoluciones.*.product')
        .notEmpty()
        .withMessage('El ID del producto es requerido')
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    
    body('devoluciones.*.returnStatus')
        .notEmpty()
        .withMessage('El estado de devolución es requerido')
        .isIn(['DEVUELTO', 'DEVUELTO_DAÑADO', 'NO_DEVUELTO'])
        .withMessage('El estado debe ser: DEVUELTO, DEVUELTO_DAÑADO o NO_DEVUELTO'),
    
    body('devoluciones.*.observations')
        .optional()
        .trim()
];

export const getLoansValidation = [
    query('status')
        .optional()
        .isIn(['PENDIENTE_APROBACION', 'APROBADO', 'ACTIVO', 'RECHAZADO', 'CANCELADO', 'FINALIZADO', 'PARCIALMENTE_DEVUELTO'])
        .withMessage('Estado de préstamo no válido'),
    
    query('student_id')
        .optional()
        .isMongoId()
        .withMessage('El ID del estudiante no es válido'),
    
    query('product_id')
        .optional()
        .isMongoId()
        .withMessage('El ID del producto no es válido'),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero positivo'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe estar entre 1 y 100')
];

export const getMyLoansValidation = [
    query('tipo')
        .optional()
        .isIn(['activos', 'historial', 'all'])
        .withMessage('El tipo debe ser: activos, historial o all'),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero positivo'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe estar entre 1 y 100')
];

export const loanIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('El ID del préstamo no es válido')
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