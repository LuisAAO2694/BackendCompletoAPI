//Middleware para verificar el rol del usuario
/*
    Recibe los roles permitidos como argumentos
    Verifica que el usuario tenga uno de los roles especificados
    Si no tiene el rol, retorna un error 403
*/
const roleMiddleware = (...roles) => (req, res, next) => {
    
    //Verificamos si el rol del usuario esta en los roles permitidos
    if (!roles.includes(req.user.role)) 
    {
        return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
    }
    next();
};

export default roleMiddleware;