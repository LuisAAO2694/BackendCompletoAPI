import Message from '../models/Message.js';

//Funcion para crear un nuevo mensaje
/*
    Recibe los datos del mensaje y los guarda en la base de datos
*/
const createMessage = async (messageData) => {
    return await Message.create(messageData);
};

//Funcion para buscar todos los mensajes con filtros
/*
    Recibe filtros opcionales, pagina y limite
    Incluye los datos del usuario y equipo
    Ordena por fecha de envio descendente
    Usa skip y limit para la paginacion
    Retorna los mensajes y el total de documentos
*/
const findAllMessages = async (filters = {}, page = 1, limit = 10) => {

    //Calculamos desde que posicion empieza la consulta
    const skip = (page - 1) * limit;

    //Ejecutamos ambas consultas en paralelo para mejor rendimiento
    const [messages, total] = await Promise.all([
        Message.find(filters)
            .populate('user', 'name email')
            .populate('product', 'name')
            .sort({ sentDate: -1 })
            .skip(skip)
            .limit(limit),
        Message.countDocuments(filters)
    ]);

    return { messages, total };
};

//Funcion para buscar mensajes por usuario
/*
    Recibe el ID del usuario, pagina y limite
    Incluye los datos del equipo
    Ordena por fecha de envio descendente
    Retorna los mensajes y el total
*/
const findMessagesByUser = async (userId, page = 1, limit = 10) => {

    //Calculamos desde que posicion empieza la consulta
    const skip = (page - 1) * limit;

    //Ejecutamos ambas consultas en paralelo para mejor rendimiento
    const [messages, total] = await Promise.all([
        Message.find({ user: userId })
            .populate('product', 'name')
            .sort({ sentDate: -1 })
            .skip(skip)
            .limit(limit),
        Message.countDocuments({ user: userId })
    ]);

    return { messages, total };
};

//Funcion para buscar un mensaje por su ID
/*
    Recibe el ID del mensaje
    Incluye los datos del usuario y equipo
    Retorna el mensaje si existe, o null si no lo encuentra
*/
const findMessageById = async (id) => {
    return await Message.findById(id)
        .populate('user', 'name email')
        .populate('product', 'name');
};

//Funcion para agregar una respuesta a un mensaje
/*
    Recibe el ID del mensaje y la respuesta
    Actualiza el contenido y la fecha de la respuesta
    Retorna el mensaje actualizado
*/
const updateMessageResponse = async (id, response) => {
    return await Message.findByIdAndUpdate(id, { response }, { new: true });
};

//Funcion para marcar un mensaje como leido
/*
    Recibe el ID del mensaje
    Cambia el campo read a true
    Retorna el mensaje actualizado
*/
const markAsRead = async (id) => {
    return await Message.findByIdAndUpdate(id, { read: true }, { new: true });
};

const findFromManager = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
        Message.find({ user: userId, sentByManager: true })
            .populate('manager', 'name')
            .populate('product', 'name')
            .sort({ sentDate: -1 })
            .skip(skip)
            .limit(limit),
        Message.countDocuments({ user: userId, sentByManager: true })
    ]);

    return { messages, total };
};

const deleteMessage = async (id) => {
    return await Message.findByIdAndDelete(id);
};

export default {
    createMessage,
    findAllMessages,
    findMessagesByUser,
    findMessageById,
    updateMessageResponse,
    markAsRead,
    findFromManager,
    deleteMessage
};