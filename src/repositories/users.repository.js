import User from '../models/User.js';

//Funcion para crear un nuevo usuario
/*
    Rece los datos del usuario y los guarda en la base de datos
    El password se encripta automaticamente por el hook pre-save
*/
const createUser = async (userData) => {
    return await User.create(userData);
};

//Funcion para buscar todos los usuarios con filtros
/*
    Rece filtros opcionales, pagina y limite
    Excluye el password de los resultados
    Usa skip y limit para la paginacion
    Retorna los usuarios y el total de documentos
*/
const findAllUsers = async (filters = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(filters)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(filters)
    ]);

    return { users, total };
};

//Funcion para buscar un usuario por su email
/*
    Rece el email del usuario
    Retorna el usuario si existe, o null si no lo encuentra
*/
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

//Funcion para buscar un usuario por su ID
/*
    Rece el ID del usuario
    Retorna el usuario si existe, o null si no lo encuentra
*/
const findUserById = async (id) => {
    return await User.findById(id);
};

export default {
    createUser,
    findAllUsers,
    findUserByEmail,
    findUserById
};