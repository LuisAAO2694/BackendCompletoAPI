import loansRepository from '../repositories/loans.repository.js';
import productsRepository from '../repositories/products.repository.js';

const create = async (loanData) => {
    const product = await productsRepository.findProductById(loanData.product);
    if (!product) {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
    }
    if (product.status !== 'disponible') {
        const error = new Error('Producto no disponible');
        error.status = 400;
        throw error;
    }
    await productsRepository.updateProduct(loanData.product, { status: 'prestado' });
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

const getActive = async (page, limit) => {
    const result = await loansRepository.findActiveLoans(page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.loans
    };
};

const getByUser = async (userId, page, limit) => {
    const result = await loansRepository.findLoansByUser(userId, page, limit);
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

const updateStatus = async (id, status) => {
    const loan = await loansRepository.findLoanById(id);
    if (!loan) {
        const error = new Error('Préstamo no encontrado');
        error.status = 404;
        throw error;
    }
    const actualReturnDate = status === 'entregado' ? new Date() : null;
    return await loansRepository.updateLoanStatus(id, status, actualReturnDate);
};

export default { create, getAll, getActive, getByUser, getById, updateStatus };
