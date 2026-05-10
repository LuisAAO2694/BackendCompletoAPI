import productsRepository from '../repositories/products.repository.js';

const create = async (productData) => {
    return await productsRepository.createProduct(productData);
};

const getAll = async (filters, page, limit) => {
    const result = await productsRepository.findAllProducts(filters, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.products
    };
};

const getById = async (id) => {
    const product = await productsRepository.findProductById(id);
    if (!product) {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
    }
    return product;
};

const update = async (id, productData) => {
    const product = await productsRepository.updateProduct(id, productData);
    if (!product) {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
    }
    return product;
};

const remove = async (id) => {
    const product = await productsRepository.deleteProduct(id);
    if (!product) {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
    }
    return product;
};

export default { create, getAll, getById, update, remove };
