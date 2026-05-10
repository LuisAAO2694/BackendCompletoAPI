import { verifyToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

export default authMiddleware;
