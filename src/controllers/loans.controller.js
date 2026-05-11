import loansService from '../services/loans.service.js';

//Controlador para crear un nuevo prestamo
/*
    Recibe los datos del prestamo en el body de la peticion
    Llama al servicio de prestamos para crearlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el prestamo creado con codigo 201
*/
const create = async (req, res, next) => {
    try 
    {
        const loan = await loansService.create(req.body);
        res.status(201).json(loan);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener todos los prestamos (admin)
/*
    Recibe filtros por query params (status, student_id, product_id, page, limit)
    Construye los filtros para la busqueda
    Llama al servicio de prestamos para obtenerlos
    Si hay un error, lo pasa al middleware de errores
    Retorna los prestamos con informacion de paginacion
*/
const getAll = async (req, res, next) => {
    try 
    {
        const { status, student_id, product_id, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (status) filters.status = status;
        if (student_id) filters.student = student_id;
        if (product_id) filters['equipment.product'] = product_id;
        const result = await loansService.getAll(filters, page, limit);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener mis prestamos (estudiante)
/*
    Recibe el tipo de prestamo por query param (activos, historial, all)
    Recibe paginacion por query params
    Llama al servicio de prestamos para obtenerlos
    Si hay un error, lo pasa al middleware de errores
    Retorna los prestamos del usuario autenticado
*/
const getMyLoans = async (req, res, next) => {
    try 
    {
        const { tipo = 'all', page = 1, limit = 10 } = req.query;
        const result = await loansService.getByStudent(req.user.id, tipo, page, limit);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener un prestamo por ID
/*
    Recibe el ID del prestamo por parametro de ruta
    Llama al servicio de prestamos para obtenerlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el prestamo con datos relacionados
*/
const getById = async (req, res, next) => {
    try
    {
        const loan = await loansService.getById(req.params.id);
        res.json(loan);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para aprobar un prestamo (admin)
/*
    Recibe el ID del prestamo por parametro de ruta
    Recibe observaciones opcionales en el body
    Llama al servicio de prestamos para aprobarlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el prestamo aprobado
*/
const approve = async (req, res, next) => {
    try 
    {
        const { observaciones } = req.body;
        const loan = await loansService.approve(req.params.id, req.user.id, observaciones);
        res.json(loan);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para rechazar un prestamo (admin)
/*
    Recibe el ID del prestamo por parametro de ruta
    Recibe la razon del rechazo en el body
    Llama al servicio de prestamos para rechazarlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el prestamo rechazado
*/
const reject = async (req, res, next) => {
    try 
    {
        const { razon } = req.body;
        const loan = await loansService.reject(req.params.id, razon);
        res.json(loan);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para entregar un prestamo aprobado (admin)
/*
    Recibe el ID del prestamo por parametro de ruta
    Recibe observaciones opcionales en el body
    Llama al servicio de prestamos para entregarlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el prestamo en estado ACTIVO
*/
const deliver = async (req, res, next) => {
    try 
    {
        const { observaciones } = req.body;
        const loan = await loansService.deliver(req.params.id, observaciones);
        res.json(loan);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para cancelar un prestamo (estudiante)
/*
    Recibe el ID del prestamo por parametro de ruta
    Llama al servicio de prestamos para cancelarlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el prestamo cancelado
*/
const cancel = async (req, res, next) => {
    try 
    {
        const loan = await loansService.cancel(req.params.id);
        res.json(loan);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para registrar devoluciones de un prestamo (admin)
/*
    Recibe el ID del prestamo por parametro de ruta
    Recibe la lista de devoluciones en el body
    Llama al servicio de prestamos para procesarlas
    Si hay un error, lo pasa al middleware de errores
    Retorna el prestamo actualizado
*/
const devolutions = async (req, res, next) => {
    try 
    {
        const { devoluciones } = req.body;
        const loan = await loansService.devolutions(req.params.id, devoluciones);
        res.json(loan);
    } 
    catch (error)
    {
        next(error);
    }
};

export default { create, getAll, getMyLoans, getById, approve, reject, deliver, cancel, devolutions };