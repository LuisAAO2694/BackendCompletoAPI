import usersService from '../services/users.service.js';

//Controlador para obtener el perfil del usuario
/*
    Recibe el ID del usuario de req.user (del token)
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

export default { getProfile };