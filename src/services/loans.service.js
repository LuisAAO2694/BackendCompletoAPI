import mongoose from 'mongoose';
import loansRepository from '../repositories/loans.repository.js';
import productsRepository from '../repositories/products.repository.js';
import Product from '../models/Product.js';

const create = async (loanData) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const estimatedDate = new Date(loanData.estimatedReturnDate);

    if (estimatedDate < tomorrow) {
        const error = new Error('fecha_fin_estimada debe ser al menos mañana');
        error.status = 400;
        throw error;
    }

    for (const eq of loanData.equipment) {
        const product = await productsRepository.findProductById(eq.product);
        if (!product) {
            const error = new Error(`Producto ${eq.product} no encontrado`);
            error.status = 404;
            throw error;
        }
        if (product.status !== 'disponible') {
            const error = new Error('Equipo no disponible');
            error.status = 400;
            throw error;
        }
    }

    return await loansRepository.createLoan(loanData);
};

const getAll = async (filters, page, limit) => {
    const result = await loansRepository.findAllLoans(filters, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.loans
    };
};

const getByStudent = async (studentId, type, page, limit) => {
    const result = await loansRepository.findLoansByStudent(studentId, type, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.loans
    };
};

const getById = async (id) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return loan;
};

const approve = async (id, managedBy, observations) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.approveLoan(id, managedBy, observations);
};

const reject = async (id, reason) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    if (!reason) {
        const error = new Error('razon es requerido');
        error.status = 400;
        throw error;
    }
    return await loansRepository.rejectLoan(id, reason);
};

const deliver = async (id, observations) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.deliverLoan(id, observations);
};

const cancel = async (id) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.cancelLoan(id);
};

const devolutions = async (id, returns) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    return await loansRepository.processDevolutions(id, returns);
};

export default { create, getAll, getByStudent, getById, approve, reject, deliver, cancel, devolutions };