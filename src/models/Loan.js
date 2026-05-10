import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        loanDate: { type: Date, default: Date.now },
        estimatedReturnDate: { type: Date, required: true },
        actualReturnDate: { type: Date },
        status: {
            type: String,
            enum: ['activo', 'entregado'],
            default: 'activo'
        },
        observations: { type: String }
    },
    {
        timestamps: true
    }
);

loanSchema.post('save', async function() {
    if (this.status === 'entregado') {
        await mongoose.model('Product').findByIdAndUpdate(this.product, { status: 'disponible' });
    }
});

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;
