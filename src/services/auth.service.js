import usersRepository from '../repositories/users.repository.js';
import { generateToken } from '../utils/jwt.js';

const register = async (userData) => {
    const existingUser = await usersRepository.findUserByEmail(userData.email);
    if (existingUser) {
        const error = new Error('El email ya está registrado');
        error.status = 400;
        throw error;
    }
    return await usersRepository.createUser(userData);
};

const login = async (email, password) => {
    const user = await usersRepository.findUserByEmail(email);
    if (!user) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

export default { register, login };
