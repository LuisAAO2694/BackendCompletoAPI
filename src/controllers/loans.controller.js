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
        const { status, user, product, fechaDesde, fechaHasta, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (status) filters.status = status;
        if (user) filters.user = user;
        if (product) filters.product = product;
        if (fechaDesde || fechaHasta) {
            filters.loanDate = {};
            if (fechaDesde) filters.loanDate.$gte = new Date(fechaDesde);
            if (fechaHasta) filters.loanDate.$lte = new Date(fechaHasta);
        }
        const result = await loansService.getAll(filters, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getActive = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await loansService.getActive(page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getMine = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await loansService.getByUser(req.user.id, page, limit);
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

const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const loan = await loansService.updateStatus(req.params.id, status);
        res.json(loan);
    } catch (error) {
        next(error);
    }
};

export default { create, getAll, getActive, getMine, getById, updateStatus };
