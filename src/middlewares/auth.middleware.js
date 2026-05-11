import { verifyToken } from '../utils/jwt.js';

//Middleware para verificar si el usuario esta autenticado
/*
    Extrae el token del header Authorization
    Verifica que el token sea valido
    Si es valido, agrega los datos del usuario a req.user
    Si no, retorna un error 401
*/
const authMiddleware = (req, res, next) => {

    //Extraemos el token del header Authorization (formato: Bearer <token>)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) 
        {
        return res.status(401).json({ message: 'No autorizado' });
    }
    try 
    {
        //Verificamos el token y extraemos los datos
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } 
    catch 
    {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

export default authMiddleware;