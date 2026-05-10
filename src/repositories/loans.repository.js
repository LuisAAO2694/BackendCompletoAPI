import mongoose from 'mongoose';
import Loan from '../models/Loan.js';

const createLoan = async (loanData) => {
    return await Loan.create(loanData);
};

const findAllLoans = async (filters = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
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

const findLoansByStudent = async (studentId, type = 'all', page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    let statusFilter = {};

    if (type === 'activos') {
        statusFilter = { status: { $in: ['PENDIENTE_APROBACION', 'APROBADO', 'ACTIVO'] } };
    } else if (type === 'historial') {
        statusFilter = { status: { $in: ['FINALIZADO', 'RECHAZADO', 'CANCELADO', 'PARCIALMENTE_DEVUELTO'] } };
    }

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

const findLoanById = async (id) => {
    return await Loan.findById(id)
        .populate('student', 'name email')
        .populate('managedBy', 'name email')
        .populate('equipment.product', 'name serialNumber');
};

const updateLoanStatus = async (id, status, data = {}) => {
    return await Loan.findByIdAndUpdate(id, { status, ...data }, { new: true });
};

const approveLoan = async (id, managedBy, observations = null) => {
    return await Loan.findByIdAndUpdate(id, {
        status: 'APROBADO',
        managedBy,
        approvalObservations: observations
    }, { new: true });
};

const rejectLoan = async (id, reason) => {
    return await Loan.findByIdAndUpdate(id, {
        status: 'RECHAZADO',
        reason
    }, { new: true });
};

const deliverLoan = async (id, observations = null) => {
    const loan = await Loan.findById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    if (loan.status !== 'APROBADO') {
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

const cancelLoan = async (id) => {
    const loan = await Loan.findById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    if (loan.status !== 'PENDIENTE_APROBACION') {
        const error = new Error('Solo se puede cancelar en estado PENDIENTE_APROBACION');
        error.status = 400;
        throw error;
    }

    loan.status = 'CANCELADO';
    return await loan.save();
};

const processDevolutions = async (id, returns) => {
    const loan = await Loan.findById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }

    loan.returns = returns;
    loan.actualReturnDate = new Date();

    const statusMap = { DEVUELTO: 'DEVUELTO', DEVUELTO_DAÑADO: 'DEVUELTO_DAÑADO', NO_DEVUELTO: 'NO_DEVUELTO' };

    returns.forEach(ret => {
        const eq = loan.equipment.find(e => e.product.toString() === ret.product.toString());
        if (eq) {
            eq.status = statusMap[ret.returnStatus];
            eq.observations = ret.observations;
        }
    });

    const allReturned = loan.equipment.every(eq => eq.status !== 'PRESTADO');
    const allDevuelto = loan.equipment.every(eq => eq.status === 'DEVUELTO' || eq.status === 'NO_DEVUELTO');

    loan.status = allReturned ? (allDevuelto ? 'FINALIZADO' : 'PARCIALMENTE_DEVUELTO') : loan.status;

    for (const eq of loan.equipment) {
        const newStatus = eq.status === 'DEVUELTO' ? 'disponible' :
            eq.status === 'DEVUELTO_DAÑADO' ? 'mantenimiento' :
                eq.status === 'NO_DEVUELTO' ? 'mantenimiento' : 'prestado';
        await mongoose.model('Product').findByIdAndUpdate(eq.product, { status: newStatus });
    }

    return await loan.save();
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
    processDevolutions
};