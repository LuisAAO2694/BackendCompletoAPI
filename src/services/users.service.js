import usersRepository from '../repositories/users.repository.js';

//Funcion para obtener todos los usuarios con filtros
/*
    Rece filtros, pagina y limite
    Construye la respuesta con paginacion
    Retorna el total, pagina, limite y los usuarios
*/
const getAll = async (filters, page, limit) => {
    const result = await usersRepository.findAllUsers(filters, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.users
    };
};

//Funcion para obtener un usuario por ID
/*
    Rece el ID del usuario
    Busca el usuario en la base de datos
    Si no lo encuentra, lanza un error 404
    Retorna el usuario
*/
const getById = async (id) => {
    const user = await usersRepository.findUserById(id);
    
    if (!user) 
    {
        const error = new Error('Usuario no encontrado');
        error.status = 404;
        throw error;
    }
    return user;
};

export default { getAll, getById };