import usersRepository from '../repositories/users.repository.js';

const getById = async (id) => {
    const user = await usersRepository.findUserById(id);
    if (!user) {
        const error = new Error('Usuario no encontrado');
        error.status = 404;
        throw error;
    }
    return user;
};

export default { getById };
