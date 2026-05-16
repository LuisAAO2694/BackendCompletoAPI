import app from './src/app.js';
import User from './src/models/User.js';

//Puerto donde se ejecutara el servidor
const PORT = process.env.PORT || 3000;

//Funcion para crear el usuario encargado por defecto
/*
    Verifica si ya existe un usuario con rol encargado
    Si no existe, lo crea con credenciales por defecto
    Se ejecuta cada vez que inicia el servidor
*/
const seedAdmin = async () => {

    //Contamos los usuarios con rol encargado'
    const count = await User.countDocuments({ role: 'encargado' });

    //Si no hay encargado, creamos uno
    if (count === 0) 
    {
        await User.create({
            name: 'Admin',
            email: 'admin@lab.com',
            password: 'admin1234',
            role: 'encargado'
        });
        console.log('Admin creado por defecto');
    }
};

//Iniciamos el servidor
app.listen(PORT, async () => {

    console.log(`Servidor corriendo en puerto ${PORT}`);

    //Ejecutamos el seed del encargado al iniciar
    await seedAdmin();
});