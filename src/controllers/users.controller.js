import usersService from '../services/users.service.js';

const getProfile = async (req, res, next) => {
    try {
        const user = await usersService.getById(req.user.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export default { getProfile };
