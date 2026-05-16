import usersRepository from '../repositories/users.repository.js';
import { generateToken } from '../utils/jwt.js';

//Funcion para registrar un nuevo usuario
/*
    Recibe los datos del usuario (name, email, password)
    Verifica que el email no este registrado
    Crea el usuario en la base de datos
    Retorna el usuario creado
*/
const register = async (userData) => {

    //Verificamos que el email no este registrado
    const existingUser = await usersRepository.findUserByEmail(userData.email);

    if (existingUser) 
    {
        const error = new Error('El email ya está registrado');
        error.status = 400;
        throw error;
    }
    return await usersRepository.createUser(userData);
};

//Funcion para iniciar sesion
/*
    Recibe el email y password del usuario
    Verifica que el usuario exista y las credenciales sean correctas
    Genera un token JWT con los datos del usuario
    Retorna el usuario y el token
*/
const login = async (email, password) => {
    
    //Buscamos el usuario por email
    const user = await usersRepository.findUserByEmail(email);
    if (!user) 
    {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    //Comparamos la password ingresada con la almacenada
    const isMatch = await user.comparePassword(password);
    if (!isMatch) 
    {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    //Generamos el token JWT con los datos del usuario
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    //Retornamos el usuario (sin password) y el token
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: user.studentId || null,
            career: user.career || null,
            phone: user.phone || null
        },
        token
    };
};

export default { register, login };