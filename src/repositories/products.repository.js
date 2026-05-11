import Product from '../models/Product.js';

//Funcion para crear un nuevo equipo
/*
    Recibe los datos del equipo y los guarda en la base de datos
*/
const createProduct = async (productData) => {
    return await Product.create(productData);
};

//Funcion para buscar todos los equipos con filtros
/*
    Recibe filtros opcionales, pagina y limite
    Usa skip y limit para la paginacion
    Retorna los equipos y el total de documentos
*/
const findAllProducts = async (filters = {}, page = 1, limit = 10) => {

    //Calculamos desde que posicion empieza la consulta
    const skip = (page - 1) * limit;

    //Ejecutamos ambas consultas en paralelo para mejor rendimiento
    const [products, total] = await Promise.all([
        Product.find(filters).skip(skip).limit(limit),
        Product.countDocuments(filters)
    ]);

    return { products, total };
};

//Funcion para buscar un equipo por su ID
/*
    Recibe el ID del equipo
    Retorna el equipo si existe, o null si no lo encuentra
*/
const findProductById = async (id) => {
    return await Product.findById(id);
};

//Funcion para actualizar un equipo
/*
    Recibe el ID y los nuevos datos del equipo
    Retorna el equipo actualizado
*/
const updateProduct = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
};

//Funcion para eliminar un equipo
/*
    Recibe el ID del equipo a eliminar
    Retorna el equipo eliminado
*/
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