import mongoose from 'mongoose';

const equipmentReturnSchema = new mongoose.Schema({
    //Producto que se devuelve
    product: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true //Campo obligatorio
    },

    //Estado en que se devuelve el equipo
    returnStatus: 
    {
        type: String,
        enum: ['DEVUELTO', 'DEVUELTO_DAÑADO', 'NO_DEVUELTO'] //Solo permite estos valores
    },

    //Observaciones sobre la devolucion
    observations: 
    {
        type: String //Tipo texto, es opcional
    }
}, { _id: false });

const loanSchema = new mongoose.Schema(

    {
        //Estudiante que solicita el prestamo
        student: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true //Campo obligatorio
        },

        //Encargado que gestiona el prestamo
        managedBy: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' //No es obligatorio al crear el prestamo
        },

        //Lista de equipos que se prestan
        equipment: 
        [{
            //Equipo prestado
            product: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true //Campo obligatorio
            },

            //Estado actual del equipo en este prestamo
            status: 
            {
                type: String,
                enum: ['PENDIENTE', 'PRESTADO', 'DEVUELTO', 'DEVUELTO_DAÑADO', 'NO_DEVUELTO'],
                default: 'PENDIENTE' //Por defecto esta pendiente
            },

            //Observaciones del equipo
            observations: 
            {
                type: String //Tipo texto, es opcional
            }
        }],

        //Fecha estimada de devolucion
        estimatedReturnDate: 
        {
            type: Date,
            required: true //Campo obligatorio
        },

        //Fecha en que se entrego realmente el equipo
        startDate: 
        {
            type: Date //Se define cuando se entrega el equipo
        },

        //Fecha real en que se devolvio el equipo
        actualReturnDate: 
        {
            type: Date //Se define cuando se devuelven todos los equipos
        },

        //Estado actual del prestamo
        status: 
        {
            type: String,

            //Solo permite estos valores
            enum: ['PENDIENTE_APROBACION', 'APROBADO', 'ACTIVO', 'RECHAZADO', 'CANCELADO', 'FINALIZADO', 'PARCIALMENTE_DEVUELTO'],

            //Por defecto queda en espera de aprobacion
            default: 'PENDIENTE_APROBACION'
        },

        //Razon del rechazo o cancelacion
        reason: 
        {
            type: String //Tipo texto, es opcional
        },

        //Observaciones al momento de aprobar el prestamo
        approvalObservations: 
        {
            type: String //Tipo texto, es opcional
        },

        //Lista de devoluciones realizadas
        returns: [equipmentReturnSchema],

        //Notas adicionales del prestamo
        notes: 
        {
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

//Aqui tenemos el hook post-save
/*
    Despues de guardar el prestamo,
    se ejecutara esta funcion para actualizar el estado de los equipos
*/
loanSchema.post('save', async function() 
{
    //Si el prestamo pasa a estado activo o finalizado,
    //marcamos los equipos como prestados
    if (this.status === 'ACTIVO' || this.status === 'FINALIZADO' || this.status === 'PARCIALMENTE_DEVUELTO') 
    {
        for (const eq of this.equipment) 
        {
            if (eq.status === 'PRESTADO') 
            {
                await mongoose.model('Product').findByIdAndUpdate(eq.product, { status: 'prestado' });
            }
        }
    }

    //Si el prestamo se cancela, rechaza o finaliza,
    //liberamos los equipos que no esten	devueltos
    if (this.status === 'FINALIZADO' || this.status === 'CANCELADO' || this.status === 'RECHAZADO') 
    {
        const allReturned = this.equipment.every(eq => eq.status !== 'PRESTADO');
        if (allReturned || this.status !== 'ACTIVO') 
        {
            for (const eq of this.equipment) 
            {
                if (eq.status !== 'DEVUELTO' && eq.status !== 'DEVUELTO_DAÑADO' && eq.status !== 'NO_DEVUELTO') 
                {
                    await mongoose.model('Product').findByIdAndUpdate(eq.product, { status: 'disponible' });
                }
            }
        }
    }
});

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;