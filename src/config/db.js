import mongoose from 'mongoose';

//Funcion para conectar a la base de datos MongoDB
/*
    Usa la URI de MongoDB de las variables de entorno
    Si la conexion es exitosa, muestra un mensaje de confirmacion
    Si hay un error, muestra el error y termina el proceso
*/
const connectDB = async () => 
    {
    try 
    {
        //Conectamos a MongoDB usando la URI del archivo .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB conectado");
    } 
    catch (error) 
    {
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;