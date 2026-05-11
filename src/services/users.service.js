import usersRepository from '../repositories/users.repository.js';

//Funcion para obtener un usuario por ID
/*
    Recibe el ID del usuario
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

export default { getById };