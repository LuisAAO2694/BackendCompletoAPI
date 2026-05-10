import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String },
        category: { type: String, required: true },
        serialNumber: { type: String, unique: true },
        status: {
            type: String,
            enum: ['disponible', 'prestado', 'mantenimiento'],
            default: 'disponible'
        },
        image: { type: String }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
