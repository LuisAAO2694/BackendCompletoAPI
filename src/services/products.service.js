import productsRepository from '../repositories/products.repository.js';

//Funcion para crear un nuevo producto
/*
    Recibe los datos del producto
    Llama al repositorio para crearlo
    Retorna el producto creado
*/
const create = async (productData) => {
    return await productsRepository.createProduct(productData);
};

//Funcion para obtener todos los productos con filtros
/*
    Recibe filtros, pagina y limite
    Construye la respuesta con paginacion
    Retorna el total, pagina, limite y los productos
*/
const getAll = async (filters, page, limit) => {
    const result = await productsRepository.findAllProducts(filters, page, limit);
    return {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: result.products
    };
};

//Funcion para obtener un producto por ID
/*
    Recibe el ID del producto
    Busca el producto en la base de datos
    Si no lo encuentra, lanza un error 404
    Retorna el producto
*/
const getById = async (id) => {
    const product = await productsRepository.findProductById(id);

    if (!product) 
    {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
    }
    return product;
};

//Funcion para actualizar un producto
/*
    Recibe el ID y los nuevos datos del producto
    Llama al repositorio para actualizarlo
    Si no lo encuentra, lanza un error 404
    Retorna el producto actualizado
*/
const update = async (id, productData) => {
    const product = await productsRepository.updateProduct(id, productData);
    if (!product) 
    {
        const error = new Error('Producto no encontrado');
        error.status = 404;
        throw error;
    }
    return product;
};

//Funcion para eliminar un producto
/*
    Recibe el ID del producto a eliminar
    Llama al repositorio para eliminarlo
    Si no lo encuentra, lanza un error 404
    Retorna el producto eliminado
*/
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