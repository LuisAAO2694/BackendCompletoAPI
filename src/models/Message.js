import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(

    {
        //Usuario que envio el mensaje
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true //Campo obligatorio
        },

        //Equipo sobre el que trata el mensaje (opcional)
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' //Es opcional, el mensaje puede ser general
        },

        //Asunto del mensaje
        subject: {
            type: String, //Tipo texto
            required: true //Campo obligatorio
        },

        //Contenido del mensaje
        content: {
            type: String, //Tipo texto
            required: true //Campo obligatorio
        },

        //Si el mensaje fue leido por el encargado
        read: {
            type: Boolean,
            default: false //Por defecto no ha sido leido
        },

        //Fecha en que se envio el mensaje
        sentDate: {
            type: Date,
            default: Date.now //Por defecto la fecha actual
        },

        //Respuesta del encargado (documento embebido)
        response: {
            //Contenido de la respuesta
            content: {
                type: String //Tipo texto
            },
            //Fecha de la respuesta
            date: {
                type: Date //Tipo fecha
            }
        }
    },
    {
        //Crea automaticamente:
        //createdAt
        //updatedAt
        timestamps: true
    }

);

const Message = mongoose.model('Message', messageSchema);

export default Message;