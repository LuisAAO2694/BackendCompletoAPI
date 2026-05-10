import Product from '../models/Product.js';

const createProduct = async (productData) => {
    return await Product.create(productData);
};

const findAllProducts = async (filters = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        Product.find(filters).skip(skip).limit(limit),
        Product.countDocuments(filters)
    ]);
    return { products, total };
};

const findProductById = async (id) => {
    return await Product.findById(id);
};

const updateProduct = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export default {
    createProduct,
    findAllProducts,
    findProductById,
    updateProduct,
    deleteProduct
};
