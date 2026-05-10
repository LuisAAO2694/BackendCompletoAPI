import User from '../models/User.js';

const createUser = async (userData) => {
    return await User.create(userData);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const findUserById = async (id) => {
    return await User.findById(id);
};

export default {
    createUser,
    findUserByEmail,
    findUserById
};
