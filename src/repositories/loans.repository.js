import mongoose from 'mongoose';
import Loan from '../models/Loan.js';

//Funcion para crear un nuevo prestamo
/*
    Recibe los datos del prestamo y los guarda en la base de datos
*/
const createLoan = async (loanData) => {
    return await Loan.create(loanData);
};

//Funcion para buscar todos los prestamos con filtros
/*
    Recibe filtros opcionales, pagina y limite
    Incluye los datos del estudiante, encargado y equipos
    Ordena por fecha de creacion descendente (mas recientes primero)
    Usa skip y limit para la paginacion
    Retorna los prestamos y el total de documentos
*/
const findAllLoans = async (filters = {}, page = 1, limit = 10) => {
    
    //Calculamos desde que posicion empieza la consulta
    const skip = (page - 1) * limit;

    //Ejecutamos ambas consultas en paralelo para mejor rendimiento
    const [loans, total] = await Promise.all([
        Loan.find(filters)
            .populate('student', 'name email')
            .populate('managedBy', 'name email')
            .populate('equipment.product', 'name serialNumber')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Loan.countDocuments(filters)
    ]);

    return { loans, total };
};

//Funcion para buscar prestamos por estudiante
/*
    Recibe el ID del estudiante, tipo de prestamo, pagina y limite
    Filtra por activos o historial segun el tipo
    Incluye los datos de los equipos
    Ordena por fecha de creacion descendente
    Retorna los prestamos y el total
*/
const findLoansByStudent = async (studentId, type = 'all', page = 1, limit = 10) => {
    
    //Calculamos desde que posicion empieza la consulta
    const skip = (page - 1) * limit;

    //Filtramos segun el tipo de prestamo solicitado
    let statusFilter = {};

    if (type === 'activos') 
    {
        //Prestamos activos: pendiente, aprobado y activo
        statusFilter = { status: { $in: ['PENDIENTE_APROBACION', 'APROBADO', 'ACTIVO'] } };
    } 
    else if (type === 'historial') 
    {
        //Historial: finalizados, rechazados, cancelados y parcialmente devueltos
        statusFilter = { status: { $in: ['FINALIZADO', 'RECHAZADO', 'CANCELADO', 'PARCIALMENTE_DEVUELTO'] } };
    }

    //Ejecutamos ambas consultas en paralelo para mejor rendimiento
    const [loans, total] = await Promise.all([
        Loan.find({ student: studentId, ...statusFilter })
            .populate('equipment.product', 'name serialNumber')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Loan.countDocuments({ student: studentId, ...statusFilter })
    ]);

    return { loans, total };
};

//Funcion para buscar un prestamo por su ID
/*
    Recibe el ID del prestamo
    Incluye los datos del estudiante, encargado y equipos
    Retorna el prestamo si existe, o null si no lo encuentra
*/
const findLoanById = async (id) => {
    return await Loan.findById(id)
        .populate('student', 'name email')
        .populate('managedBy', 'name email')
        .populate('equipment.product', 'name serialNumber');
};

//Funcion para actualizar el estado de un prestamo
/*
    Recibe el ID, el nuevo estado y datos adicionales
    Retorna el prestamo actualizado
*/
const updateLoanStatus = async (id, status, data = {}) => {
    return await Loan.findByIdAndUpdate(id, { status, ...data }, { new: true });
};

//Funcion para aprobar un prestamo
/*
    Recibe el ID del prestamo, el ID del encargado y observaciones
    Cambia el estado a APROBADO
    Registra quien aprobo el prestamo y las observaciones
*/
const approveLoan = async (id, managedBy, observations = null) => {
    return await Loan.findByIdAndUpdate(id, 
    {
        status: 'APROBADO',
        managedBy,
        approvalObservations: observations
    }, { new: true });
};

//Funcion para rechazar un prestamo
/*
    Recibe el ID del prestamo y la razon del rechazo
    Cambia el estado a RECHAZADO
*/
const rejectLoan = async (id, reason) => {
    return await Loan.findByIdAndUpdate(id, 
    {
        status: 'RECHAZADO',
        reason
    }, { new: true });
};

//Funcion para entregar un prestamo aprobado
/*
    Recibe el ID del prestamo y observaciones opcionales
    Valida que el prestamo este en estado APROBADO
    Cambia el estado a ACTIVO, establece la fecha de inicio
    Marca todos los equipos como PRESTADO
*/
const deliverLoan = async (id, observations = null) => {
    const loan = await Loan.findById(id);

    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }

    if (loan.status !== 'APROBADO') 
    {
        const error = new Error('El préstamo no está en estado APROBADO');
        error.status = 400;
        throw error;
    }

    loan.status = 'ACTIVO';
    loan.startDate = new Date();
    loan.equipment.forEach(eq => {
        eq.status = 'PRESTADO';
    });
    if (observations) loan.notes = observations;
    return await loan.save();
};

//Funcion para cancelar un prestamo
/*
    Recibe el ID del prestamo
    Valida que el prestamo este en estado PENDIENTE_APROBACION
    Cambia el estado a CANCELADO
*/
const cancelLoan = async (id) => {
    const loan = await Loan.findById(id);

    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }

    if (loan.status !== 'PENDIENTE_APROBACION') 
    {
        const error = new Error('Solo se puede cancelar en estado PENDIENTE_APROBACION');
        error.status = 400;
        throw error;
    }

    loan.status = 'CANCELADO';
    return await loan.save();
};

//Funcion para procesar las devoluciones de un prestamo
/*
    Recibe el ID del prestamo y la lista de devoluciones
    Actualiza el estado de cada equipo segun la devolucion
    Calcula si el prestamo queda FINALIZADO o PARCIALMENTE_DEVUELTO
    Actualiza el estado de los productos en el catalogo
*/
const processDevolutions = async (id, returns) => {
    const loan = await Loan.findById(id);

    if (!loan) 
    {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }

    //Guardamos las devoluciones y la fecha actual
    loan.returns = returns;
    loan.actualReturnDate = new Date();

    //Mapeo de estados de devolucion
    const statusMap = {
        'DEVUELTO': 'DEVUELTO',
        'DEVUELTO_DAÑADO': 'DEVUELTO_DAÑADO',
        'NO_DEVUELTO': 'NO_DEVUELTO'
    };

    //Actualizamos el estado de cada equipo devuelto
    returns.forEach(ret => {
        const eq = loan.equipment.find(e => e.product.toString() === ret.product.toString());
        if (eq) 
        {
            eq.status = statusMap[ret.returnStatus];
            eq.observations = ret.observations;
        }
    });

    //Verificamos si todos los equipos fueron devueltos
    const allReturned = loan.equipment.every(eq => eq.status !== 'PRESTADO');
    const allDevuelto = loan.equipment.every(eq =>
        eq.status === 'DEVUELTO' || eq.status === 'NO_DEVUELTO'
    );

    //Determinamos el estado final del prestamo
    loan.status = allReturned
        ? (allDevuelto ? 'FINALIZADO' : 'PARCIALMENTE_DEVUELTO')
        : loan.status;

    //Actualizamos el estado de los productos segun como se devolvieron
    for (const eq of loan.equipment) 
    {
        const newStatus = eq.status === 'DEVUELTO'
            ? 'disponible'
            : (eq.status === 'DEVUELTO_DAÑADO' || eq.status === 'NO_DEVUELTO')
                ? 'mantenimiento'
                : 'prestado';
        await mongoose.model('Product').findByIdAndUpdate(eq.product, { status: newStatus });
    }

    return await loan.save();
};

//Funcion para buscar prestamos con equipos no devueltos
/*
    Rece pagina y limite
    Filtra prestamos que tienen equipos con status PRESTADO o NO_DEVUELTO
    Incluye los datos del estudiante y equipos
    Retorna los prestamos y el total
*/
const findLoansNotReturned = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    //Filtramos prestamos que tienen equipos no devueltos
    const filters = {
        $or: [
            { status: 'ACTIVO' },
            { status: 'PARCIALMENTE_DEVUELTO' }
        ]
    };

    const [loans, total] = await Promise.all([
        Loan.find(filters)
            .populate('student', 'name email studentId')
            .populate('managedBy', 'name email')
            .populate('equipment.product', 'name serialNumber')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Loan.countDocuments(filters)
    ]);

    //Filtramos solo los que tienen equipos no devueltos
    const filteredLoans = loans.filter(loan => 
        loan.equipment.some(eq => eq.status === 'PRESTADO' || eq.status === 'NO_DEVUELTO')
    );

    return { loans: filteredLoans, total: filteredLoans.length };
};

export default {
    createLoan,
    findAllLoans,
    findLoansByStudent,
    findLoanById,
    updateLoanStatus,
    approveLoan,
    rejectLoan,
    deliverLoan,
    cancelLoan,
    processDevolutions,
    findLoansNotReturned
};