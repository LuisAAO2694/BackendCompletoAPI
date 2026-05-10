import mongoose from 'mongoose';

const equipmentReturnSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    returnStatus: {
        type: String,
        enum: ['DEVUELTO', 'DEVUELTO_DAÑADO', 'NO_DEVUELTO']
    },
    observations: { type: String }
}, { _id: false });

const loanSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        equipment: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            status: {
                type: String,
                enum: ['PENDIENTE', 'PRESTADO', 'DEVUELTO', 'DEVUELTO_DAÑADO', 'NO_DEVUELTO'],
                default: 'PENDIENTE'
            },
            observations: { type: String }
        }],
        estimatedReturnDate: { type: Date, required: true },
        startDate: { type: Date },
        actualReturnDate: { type: Date },
        status: {
            type: String,
            enum: ['PENDIENTE_APROBACION', 'APROBADO', 'ACTIVO', 'RECHAZADO', 'CANCELADO', 'FINALIZADO', 'PARCIALMENTE_DEVUELTO'],
            default: 'PENDIENTE_APROBACION'
        },
        reason: { type: String },
        approvalObservations: { type: String },
        returns: [equipmentReturnSchema],
        notes: { type: String }
    },
    {
        timestamps: true
    }
);

loanSchema.post('save', async function() {
    if (this.status === 'ACTIVO' || this.status === 'FINALIZADO' || this.status === 'PARCIALMENTE_DEVUELTO') {
        for (const eq of this.equipment) {
            if (eq.status === 'PRESTADO') {
                await mongoose.model('Product').findByIdAndUpdate(eq.product, { status: 'prestado' });
            }
        }
    }
    if (this.status === 'FINALIZADO' || this.status === 'CANCELADO' || this.status === 'RECHAZADO') {
        const allReturned = this.equipment.every(eq => eq.status !== 'PRESTADO');
        if (allReturned || this.status !== 'ACTIVO') {
            for (const eq of this.equipment) {
                if (eq.status !== 'DEVUELTO' && eq.status !== 'DEVUELTO_DAÑADO' && eq.status !== 'NO_DEVUELTO') {
                    await mongoose.model('Product').findByIdAndUpdate(eq.product, { status: 'disponible' });
                }
            }
        }
    }
});

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;