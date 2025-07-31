import express from 'express';
import config from './connection/connection.js';
import userRouter from './endpoints/userroute.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Course Management Platform API',
      version: '1.0.0',
      description: 'API documentation for the Online Course Management Platform',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
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
    },
  },
  apis: ['./endpoints/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(config);

// Routes
app.use('/users', userRouter);


// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(5000, () => {
  console.log("Listening on port 5000");
  console.log(`API documentation available at http://localhost:5000/api-docs`);
});