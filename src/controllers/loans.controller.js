import loansService from '../services/loans.service.js';

const create = async (req, res, next) => {
    try {
        const loan = await loansService.create(req.body);
        res.status(201).json(loan);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const { status, student_id, product_id, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (status) filters.status = status;
        if (student_id) filters.student = student_id;
        if (product_id) filters['equipment.product'] = product_id;
        const result = await loansService.getAll(filters, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getMyLoans = async (req, res, next) => {
    try {
        const { tipo = 'all', page = 1, limit = 10 } = req.query;
        const result = await loansService.getByStudent(req.user.id, tipo, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const loan = await loansService.getById(req.params.id);
        res.json(loan);
    } catch (error) {
        next(error);
    }
};

const approve = async (req, res, next) => {
    try {
        const { observaciones } = req.body;
        const loan = await loansService.approve(req.params.id, req.user.id, observaciones);
        res.json(loan);
    } catch (error) {
        next(error);
    }
};

const reject = async (req, res, next) => {
    try {
        const { razon } = req.body;
        const loan = await loansService.reject(req.params.id, razon);
        res.json(loan);
    } catch (error) {
        next(error);
    }
};

const deliver = async (req, res, next) => {
    try {
        const { observaciones } = req.body;
        const loan = await loansService.deliver(req.params.id, observaciones);
        res.json(loan);
    } catch (error) {
        next(error);
    }
};

const cancel = async (req, res, next) => {
    try {
        const loan = await loansService.cancel(req.params.id);
        res.json(loan);
    } catch (error) {
        next(error);
    }
};

const devolutions = async (req, res, next) => {
    try {
        const { devoluciones } = req.body;
        const loan = await loansService.devolutions(req.params.id, devoluciones);
        res.json(loan);
    } catch (error) {
        next(error);
    }
};

export default { create, getAll, getMyLoans, getById, approve, reject, deliver, cancel, devolutions };