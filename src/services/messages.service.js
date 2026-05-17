import messagesRepository from '../repositories/messages.repository.js';

//Funcion para crear un nuevo mensaje
/*
    Recibe los datos del mensaje
    Llama al repositorio para crearlo
    Retorna el mensaje creado
*/
const create = async (messageData) => {
    return await messagesRepository.createMessage(messageData);
};

//Funcion para obtener todos los mensajes con filtros
/*
    Recibe filtros, pagina y limite
    Construye la respuesta con paginacion
    Retorna el total, pagina, limite y los mensajes
*/
const getAll = async (filters, page, limit) => {
    const result = await messagesRepository.findAllMessages(filters, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.messages
    };
};

//Funcion para obtener mensajes de un usuario
/*
    Recibe el ID del usuario, pagina y limite
    Construye la respuesta con paginacion
    Retorna el total, pagina, limite y los mensajes
*/
const getByUser = async (userId, page, limit) => {
    const result = await messagesRepository.findMessagesByUser(userId, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.messages
    };
};

//Funcion para obtener un mensaje por ID
/*
    Recibe el ID del mensaje
    Busca el mensaje en la base de datos
    Si no lo encuentra, lanza un error 404
    Retorna el mensaje
*/
const getById = async (id) => {
    const message = await messagesRepository.findMessageById(id);

    if (!message) 
    {
        const error = new Error('Mensaje no encontrado');
        error.status = 404;
        throw error;
    }
    return message;
};

//Funcion para responder un mensaje
/*
    Recibe el ID del mensaje y el contenido de la respuesta
    Actualiza el mensaje con la respuesta
    Retorna el mensaje actualizado
*/
const respond = async (id, content) => {
    const message = await messagesRepository.updateMessageResponse(id, {
        content,
        date: new Date()
    });
    
    if (!message) 
    {
        const error = new Error('Mensaje no encontrado');
        error.status = 404;
        throw error;
    }
    return message;
};

//Funcion para marcar un mensaje como leido
/*
    Recibe el ID del mensaje
    Busca el mensaje en la base de datos
    Si no lo encuentra, lanza un error 404
    Actualiza el campo read a true
    Retorna el mensaje actualizado
*/
const markAsRead = async (id) => {
    const message = await messagesRepository.markAsRead(id);

    if (!message) 
    {
        const error = new Error('Mensaje no encontrado');
        error.status = 404;
        throw error;
    }
    return message;
};

const getFromManager = async (userId, page, limit) => {
    const result = await messagesRepository.findFromManager(userId, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.messages
    };
};

const deleteMessage = async (id, userId) => {
    const message = await messagesRepository.findMessageById(id);
    if (!message) {
        const error = new Error('Mensaje no encontrado');
        error.status = 404;
        throw error;
    }
    const messageUserId = message.user._id ? String(message.user._id) : String(message.user);
    if (messageUserId !== String(userId)) {
        const error = new Error('No autorizado');
        error.status = 403;
        throw error;
    }
    await messagesRepository.deleteMessage(id);
};

export default { create, getAll, getByUser, getById, respond, markAsRead, getFromManager, deleteMessage };