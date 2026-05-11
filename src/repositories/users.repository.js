import User from '../models/User.js';

//Funcion para crear un nuevo usuario
/*
    Recibe los datos del usuario y los guarda en la base de datos
    El password se encripta automaticamente por el hook pre-save
*/
const createUser = async (userData) => {
    return await User.create(userData);
};

//Funcion para buscar un usuario por su email
/*
    Recibe el email del usuario
    Retorna el usuario si existe, o null si no lo encuentra
*/
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

//Funcion para buscar un usuario por su ID
/*
    Recibe el ID del usuario
    Retorna el usuario si existe, o null si no lo encuentra
*/
const findUserById = async (id) => {
    return await User.findById(id);
};

export default {
    createUser,
    findUserByEmail,
    findUserById
};