import jwt from 'jsonwebtoken';

//Funcion para generar un token JWT
/*
    Recibe los datos que se incluiran en el payload del token
    Firma el token con el secret de las variables de entorno
    Establece la expiracion segun JWT_EXPIRES_IN (default 1 dia)
    Retorna el token generado
*/
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, 
    {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
};

//Funcion para verificar un token JWT
/*
    Recibe el token a verificar
    Verifica la firma y la expiracion del token
    Retorna los datos decodificados del token
    Lanza un error si el token es invalido o expirado
*/
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};