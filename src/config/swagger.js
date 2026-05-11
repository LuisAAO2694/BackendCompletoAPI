import swaggerJsdoc from 'swagger-jsdoc';

//Configuracion de Swagger para documentar la API
/*
    Define el titulo, version y descripcion de la API
    Configura los servidores disponibles
    Define los esquemas de los modelos de datos
    Configura la autenticacion con JWT Bearer
*/
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Préstamo de Equipos',
            version: '1.0.0',
            description: 'API REST para gestionar préstamos de equipos de laboratorio',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'user'] },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        category: { type: 'string' },
                        serialNumber: { type: 'string' },
                        status: { type: 'string', enum: ['disponible', 'prestado', 'mantenimiento'] },
                        image: { type: 'string' },
                    },
                },
                Loan: {
                    type: 'object',
                    properties: {
                        student: { type: 'string' },
                        equipment: { type: 'array' },
                        estimatedReturnDate: { type: 'string', format: 'date-time' },
                        startDate: { type: 'string', format: 'date-time' },
                        actualReturnDate: { type: 'string', format: 'date-time' },
                        status: { type: 'string', enum: ['PENDIENTE_APROBACION', 'APROBADO', 'ACTIVO', 'RECHAZADO', 'CANCELADO', 'FINALIZADO', 'PARCIALMENTE_DEVUELTO'] },
                        reason: { type: 'string' },
                        approvalObservations: { type: 'string' },
                        notes: { type: 'string' },
                    },
                },
                Message: {
                    type: 'object',
                    properties: {
                        user: { type: 'string' },
                        product: { type: 'string' },
                        subject: { type: 'string' },
                        content: { type: 'string' },
                        read: { type: 'boolean' },
                        response: {
                            type: 'object',
                            properties: {
                                content: { type: 'string' },
                                date: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'],
};

//Exportamos la configuracion de Swagger
export const specs = swaggerJsdoc(options);