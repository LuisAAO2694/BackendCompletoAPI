import productsService from '../services/products.service.js';

//Controlador para crear un nuevo producto
/*
    Recibe los datos del producto en el body de la peticion
    Llama al servicio de productos para crearlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el producto creado con codigo 201
*/
const create = async (req, res, next) => {
    try 
    {
        const product = await productsService.create(req.body);
        res.status(201).json(product);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener todos los productos
/*
    Recibe filtros por query params (category, status, search, laboratory, page, limit)
    Construye los filtros para la busqueda
    Llama al servicio de productos para obtenerlos
    Si hay un error, lo pasa al middleware de errores
    Retorna los productos con informacion de paginacion
*/
const getAll = async (req, res, next) => {
    try 
    {
        const { category, status, search, laboratory, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (category) filters.category = category;
        if (status) filters.status = status;
        if (laboratory) filters.laboratory = laboratory;
        if (search) filters.name = { $regex: search, $options: 'i' };
        const result = await productsService.getAll(filters, page, limit);
        res.json(result);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener todas las categorías únicas
/*
    Llama al servicio para obtener las categorías
    Retorna la lista de categorías
*/
const getCategories = async (req, res, next) => {
    try 
    {
        const categories = await productsService.getCategories();
        res.json(categories);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener todos los laboratorios únicos
/*
    Llama al servicio para obtener los laboratorios
    Retorna la lista de laboratorios
*/
const getLaboratories = async (req, res, next) => {
    try 
    {
        const laboratories = await productsService.getLaboratories();
        res.json(laboratories);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para obtener un producto por ID
/*
    Recibe el ID del producto por parametro de ruta
    Llama al servicio de productos para obtenerlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el producto
*/
const getById = async (req, res, next) => {
    try 
    {
        const product = await productsService.getById(req.params.id);
        res.json(product);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para actualizar un producto
/*
    Recibe el ID del producto por parametro de ruta
    Recibe los nuevos datos en el body de la peticion
    Llama al servicio de productos para actualizarlo
    Si hay un error, lo pasa al middleware de errores
    Retorna el producto actualizado
*/
const update = async (req, res, next) => {
    try 
    {
        const product = await productsService.update(req.params.id, req.body);
        res.json(product);
    } 
    catch (error) 
    {
        next(error);
    }
};

//Controlador para eliminar un producto
/*
    Recibe el ID del producto por parametro de ruta
    Llama al servicio de productos para eliminarlo
    Si hay un error, lo pasa al middleware de errores
    Retorna un mensaje de confirmacion
*/
const remove = async (req, res, next) => {
    try 
    {
        await productsService.remove(req.params.id);
        res.json({ message: 'Producto eliminado' });
    } 
    catch (error) 
    {
        next(error);
    }
};

export default { create, getAll, getById, update, remove, getCategories, getLaboratories };