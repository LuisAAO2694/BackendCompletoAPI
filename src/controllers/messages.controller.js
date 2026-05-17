import messagesService from '../services/messages.service.js';

//Controlador para crear un nuevo mensaje
/*
    Recibe los datos del mensaje en el body de la peticion
    Agrega automaticamente el ID del usuario autenticado
    Llama al servicio de mensajes para crearlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el mensaje creado con codigo 201
*/
const create = async (req, res, next) => {
    try 
    {
        const message = await messagesService.create({ ...req.body, user: req.user.id });
        res.status(201).json(message);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener todos los mensajes (admin)
/*
    Recibe paginacion por query params
    Llama al servicio de mensajes para obtenerlos
    Si hay un error, lo pasa al middleware de errores
    Retorna los mensajes con informacion de paginacion
*/
const getAll = async (req, res, next) => {
    try 
    {
        const { page = 1, limit = 10 } = req.query;
        const result = await messagesService.getAll({}, page, limit);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener mis mensajes (estudiante)
/*
    Recibe paginacion por query params
    Llama al servicio de mensajes para obtener los del usuario
    Si hay un error, lo pasa al middleware de errores
    Retorna los mensajes del usuario autenticado
*/
const getMine = async (req, res, next) => {
    try 
    {
        const { page = 1, limit = 10 } = req.query;
        const result = await messagesService.getByUser(req.user.id, page, limit);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para responder un mensaje (admin)
/*
    Recibe el ID del mensaje por parametro de ruta
    Recibe la respuesta en el body
    Llama al servicio de mensajes para agregarla
    Si hay un error, lo pasa al middleware de errores
    Retorna el mensaje actualizado
*/
const respond = async (req, res, next) => {
    try 
    {
        const { content } = req.body;
        const message = await messagesService.respond(req.params.id, content);
        res.json(message);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para marcar un mensaje como leido (admin)
/*
    Recibe el ID del mensaje por parametro de ruta
    Llama al servicio de mensajes para marcarlo como leido
    Si hay un error, lo pasa al middleware de errores
    Retorna el mensaje actualizado
*/
const markAsRead = async (req, res, next) => {
    try 
    {
        const message = await messagesService.markAsRead(req.params.id);
        res.json(message);
    } 
    catch (error) 
    {
        next(error);
    }
};

const sendToStudent = async (req, res, next) => {
    try 
    {
        const { student, subject, content, product } = req.body;
        const message = await messagesService.create({
            user: student,
            subject,
            content,
            product,
            manager: req.user.id,
            sentByManager: true,
            read: true,
            response: {
                content: 'Recordatorio enviado automáticamente por el encargado.',
                date: new Date()
            }
        });
        res.status(201).json(message);
    } 
    catch (error) 
    {
        next(error);
    }
};

const getFromManager = async (req, res, next) => {
    try 
    {
        const { page = 1, limit = 10 } = req.query;
        const result = await messagesService.getFromManager(req.user.id, page, limit);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

const deleteMessage = async (req, res, next) => {
    try 
    {
        await messagesService.deleteMessage(req.params.id, req.user.id);
        res.json({ message: 'Mensaje eliminado' });
    } 
    catch (error) 
    {
        next(error);
    }
};

export default { create, getAll, getMine, getFromManager, respond, markAsRead, sendToStudent, deleteMessage };