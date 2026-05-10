import messagesRepository from '../repositories/messages.repository.js';

const create = async (messageData) => {
    return await messagesRepository.createMessage(messageData);
};

const getAll = async (filters, page, limit) => {
    const result = await messagesRepository.findAllMessages(filters, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.messages
    };
};

const getByUser = async (userId, page, limit) => {
    const result = await messagesRepository.findMessagesByUser(userId, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.messages
    };
};

const getById = async (id) => {
    const message = await messagesRepository.findMessageById(id);
    if (!message) {
        const error = new Error('Mensaje no encontrado');
        error.status = 404;
        throw error;
    }
    return message;
};

const respond = async (id, content) => {
    const message = await messagesRepository.updateMessageResponse(id, { content, date: new Date() });
    if (!message) {
        const error = new Error('Mensaje no encontrado');
        error.status = 404;
        throw error;
    }
    return message;
};

const markAsRead = async (id) => {
    const message = await messagesRepository.markAsRead(id);
    if (!message) {
        const error = new Error('Mensaje no encontrado');
        error.status = 404;
        throw error;
    }
    return message;
};

export default { create, getAll, getByUser, getById, respond, markAsRead };
