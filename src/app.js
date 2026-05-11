import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import { specs } from './config/swagger.js';
import errorMiddleware from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';
import loansRoutes from './routes/loans.routes.js';
import messagesRoutes from './routes/messages.routes.js';

//Cargamos las variables de entorno del archivo .env
dotenv.config();

//Creamos la aplicacion Express
const app = express();

//Conectamos a la base de datos MongoDB
connectDB();

//Configuramos los middlewares de la aplicacion
app.use(cors()); //Permite peticiones de otros origenes
app.use(express.json()); //Permite leer JSON en el body

//Configuramos Swagger para documentar la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Registramos las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/messages', messagesRoutes);

//Registramos el middleware de manejo de errores
app.use(errorMiddleware);

//Exportamos la aplicacion
export default app;