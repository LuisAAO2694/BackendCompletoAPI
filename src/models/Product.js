import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(

    {
        //Nombre del equipo
        name: {
            type: String, //Tipo texto
            required: true, //Campo obligatorio
            trim: true //Le quitamos espacios innecesarios
        },

        //Descripcion detallada del equipo
        description: {
            type: String //Tipo texto, es opcional
        },

        //Categoria a la que pertenece el equipo
        category: {
            type: String, //Tipo texto
            required: true //Campo obligatorio
        },

        //Numero de serie unico del equipo
        serialNumber: {
            type: String, //Tipo texto
            unique: true //No permite numeros de serie repetidos
        },

        //Estado actual del equipo
        status: {
            type: String,

            //Solo permite estos valores
            enum: ['disponible', 'prestado', 'mantenimiento'],

            //Por defecto estara disponible
            default: 'disponible'
        },

        //URL de la imagen del equipo
        image: {
            type: String //Tipo texto, es opcional
        }
    },
    {
        //Crea automaticamente:
        //createdAt
        //updatedAt
        timestamps: true
    }

);

const Product = mongoose.model('Product', productSchema);

export default Product;