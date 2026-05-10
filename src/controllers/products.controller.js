import productsService from '../services/products.service.js';

const create = async (req, res, next) => {
    try {
        const product = await productsService.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const { category, status, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (category) filters.category = category;
        if (status) filters.status = status;
        const result = await productsService.getAll(filters, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const product = await productsService.getById(req.params.id);
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const product = await productsService.update(req.params.id, req.body);
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await productsService.remove(req.params.id);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        next(error);
    }
};

export default { create, getAll, getById, update, remove };
