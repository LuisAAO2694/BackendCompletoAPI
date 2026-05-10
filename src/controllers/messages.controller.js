import messagesService from '../services/messages.service.js';

const create = async (req, res, next) => {
    try {
        const message = await messagesService.create({ ...req.body, user: req.user.id });
        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await messagesService.getAll({}, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getMine = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await messagesService.getByUser(req.user.id, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const respond = async (req, res, next) => {
    try {
        const { content } = req.body;
        const message = await messagesService.respond(req.params.id, content);
        res.json(message);
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const message = await messagesService.markAsRead(req.params.id);
        res.json(message);
    } catch (error) {
        next(error);
    }
};

export default { create, getAll, getMine, respond, markAsRead };
