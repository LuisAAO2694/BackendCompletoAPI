import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(

    {
        //Name del usuario
        name: {
            type: String, //Tipo texto
            required: true, //Campo obligatorio
            trim: true //Le quitamos espacios innecesarios
        },

        //Correo electrónico
        email: {
            type: String,
            required: true,
            unique: true, //No permite correos repetidos
            lowercase: true //Convierte el correo a minúsculas
        },

        //Contraseña
        password: {
            type: String,
            required: true
        },

        //Rol del usuario
        role: {
            type: String,

            //Solo permite estos valores
            enum: ['admin', 'user'],

            //Por defecto sera usuario normal
            default: 'user'
        }
    },
    {
        //Crea automáticamente:
        //createdAt
        //updatedAt
        timestamps: true
    }

);

//Aqui tenemos el hook pre-save
/*
    En si antes de guardar el user,
    se va a ejecutar esta funcion para encriptar la contraseña
*/
userSchema.pre('save', async function() {

    //Si la contraseña no fue modificada,
    //continúa normalmente
    if (!this.isModified('password')) {
        return next();
    }

    try {

        //Generamos el salt
        const salt = await bcrypt.genSalt(10);

        //Encriptamos la contraseña
        this.password = await bcrypt.hash(this.password, salt);
    } 
    catch (error) 
    {
        throw(error);
    }
});

//Metodo para comparar contraseñas
userSchema.methods.comparePassword = async function (passwordIngresada) 
{
    return await bcrypt.compare(
        passwordIngresada,
        this.password
    );

};

const User = mongoose.model('User', userSchema);

export default User;