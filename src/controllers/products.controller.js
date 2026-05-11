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
    Recibe filtros por query params (category, status, page, limit)
    Construye los filtros para la busqueda
    Llama al servicio de productos para obtenerlos
    Si hay un error, lo pasa al middleware de errores
    Retorna los productos con informacion de paginacion
*/
const getAll = async (req, res, next) => {
    try 
    {
        const { category, status, page = 1, limit = 10 } = req.query;
        const filters = {};
        if (category) filters.category = category;
        if (status) filters.status = status;
        const result = await productsService.getAll(filters, page, limit);
        res.json(result);
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

export default { create, getAll, getById, update, remove };