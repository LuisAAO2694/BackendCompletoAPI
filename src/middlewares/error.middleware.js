//Middleware para manejar errores
/*
    Captura cualquier error que ocurra en la aplicacion
    Si estamos en desarrollo, muestra el stack trace
    En produccion, oculta los detalles del error
    Retorna un JSON con el mensaje de error y el codigo de estado
*/
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorMiddleware;