import mongoose from 'mongoose';
import loansRepository from '../repositories/loans.repository.js';
import productsRepository from '../repositories/products.repository.js';
import Product from '../models/Product.js';

//Funcion para crear un nuevo prestamo
/*
    Recibe los datos del prestamo (equipment, estimatedReturnDate, notes)
    Valida que la fecha estimada sea al menos manana
    Verifica que todos los equipos esten disponibles
    Crea el prestamo en la base de datos
*/
const create = async (loanData) => {
    
    //Calculamos la fecha de manana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const estimatedDate = new Date(loanData.estimatedReturnDate);

    //Validamos que la fecha estimada sea al menos manana
    if (estimatedDate < tomorrow) 
    {
        const error = new Error('fecha_fin_estimada debe ser al menos mañana');
        error.status = 400;
        throw error;
    }

    //Verificamos que todos los equipos esten disponibles
    for (const eq of loanData.equipment) 
    {
        const product = await productsRepository.findProductById(eq.product);
        if (!product) 
        {
            const error = new Error(`Producto ${eq.product} no encontrado`);
            error.status = 404;
            throw error;
        }

        if (product.status !== 'disponible') 
        {
            const error = new Error('Equipo no disponible');
            error.status = 400;
            throw error;
        }
    }

    return await loansRepository.createLoan(loanData);
};

//Funcion para obtener todos los prestamos con filtros
/*
    Recibe filtros, pagina y limite
    Construye la respuesta con paginacion
    Retorna el total, pagina, limite y los prestamos
*/
const getAll = async (filters, page, limit) => {
    const result = await loansRepository.findAllLoans(filters, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.loans
    };
};

//Funcion para obtener prestamos de un estudiante
/*
    Recibe el ID del estudiante, tipo, pagina y limite
    Filtra por activos o historial segun el tipo
    Construye la respuesta con paginacion
    Retorna el total, pagina, limite y los prestamos
*/
const getByStudent = async (studentId, type, page, limit) => {
    const result = await loansRepository.findLoansByStudent(studentId, type, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.loans
    };
};

//Funcion para obtener un prestamo por ID
/*
    Recibe el ID del prestamo
    Busca el prestamo en la base de datos
    Si no lo encuentra, lanza un error 404
    Retorna el prestamo con datos relacionados
*/
const getById = async (id) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return loan;
};

//Funcion para aprobar un prestamo
/*
    Recibe el ID del prestamo, el ID del encargado y observaciones
    Valida que el prestamo exista
    Llama al repositorio para aprobarlo
    Retorna el prestamo aprobado
*/
const approve = async (id, managedBy, observations) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.approveLoan(id, managedBy, observations);
};

//Funcion para rechazar un prestamo
/*
    Recibe el ID del prestamo y la razon
    Valida que el prestamo exista
    Valida que se proporcione una razon
    Llama al repositorio para rechazarlo
    Retorna el prestamo rechazado
*/
const reject = async (id, reason) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }

    if (!reason) 
    {
        const error = new Error('razon es requerido');
        error.status = 400;
        throw error;
    }
    return await loansRepository.rejectLoan(id, reason);
};

//Funcion para entregar un prestamo aprobado
/*
    Recibe el ID del prestamo y observaciones
    Valida que el prestamo exista
    Llama al repositorio para entregarlo
    Retorna el prestamo en estado ACTIVO
*/
const deliver = async (id, observations) => {

    const loan = await loansRepository.findLoanById(id);

    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.deliverLoan(id, observations);
};

//Funcion para cancelar un prestamo
/*
    Recibe el ID del prestamo
    Valida que el prestamo exista
    Llama al repositorio para cancelarlo
    Retorna el prestamo cancelado
*/
const cancel = async (id) => {
    const loan = await loansRepository.findLoanById(id);

    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.cancelLoan(id);
};

//Funcion para procesar las devoluciones de un prestamo
/*
    Recibe el ID del prestamo y la lista de devoluciones
    Valida que el prestamo exista
    Llama al repositorio para procesar las devoluciones
    Retorna el prestamo actualizado
*/
const devolutions = async (id, returns) => {
    const loan = await loansRepository.findLoanById(id);

    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.processDevolutions(id, returns);
};

export default { create, getAll, getByStudent, getById, approve, reject, deliver, cancel, devolutions };