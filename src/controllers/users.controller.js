import usersService from '../services/users.service.js';

//Controlador para obtener todos los usuarios (admin)
    /*
    Rece filtros por query params (role, page, limit)
    Llama al servicio de usuarios para obtenerlos
    Si hay un error, lo pasa al middleware de errores
    Retorna los usuarios con informacion de paginacion
    */
const getAll = async (req, res, next) => {
    try 
    {
        const { role, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (role) filters.role = role;
        const result = await usersService.getAll(filters, page, limit);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener el perfil del usuario
/*
    Rece el ID del usuario de req.user (del token)
    Llama al servicio de usuarios para obtenerlo
    Si hay un error, lo pasa al middleware de errores
    Retorna los datos del usuario autenticado
*/
const getProfile = async (req, res, next) => {
    try 
    {
        const user = await usersService.getById(req.user.id);
        res.json(user);
    } 
    catch (error) 
    {
        next(error);
    }
};

export default { getAll, getProfile };