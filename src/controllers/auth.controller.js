import authService from '../services/auth.service.js';

//Controlador para registrar un nuevo usuario
/*
    Recibe los datos del usuario en el body de la peticion
    Llama al servicio de autenticacion para registrarlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el usuario creado con codigo 201
*/
const register = async (req, res, next) => {
    try 
    {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    }
    catch (error) 
    {
        next(error);
    }
};

//======================================================
//Controlador para iniciar sesion
/*
    Recibe el email y password en el body de la peticion
    Llama al servicio de autenticacion para verificar credenciales
    Si las credenciales son validas, retorna el usuario y el token
    Si hay un error, lo pasa al middleware de errores
*/
const login = async (req, res, next) => {
    try 
    {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

export default { register, login };