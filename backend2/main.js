import express from 'express';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import setupMiddleware from './middleware/config.js';
import moduleRoutes from './routes/module.routes.js';

const app = express();
// Middleware
setupMiddleware(app);
// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Management API',
      version: '1.0.0',
      description: 'API for managing courses, users, and activities'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            role: { type: 'string', enum: ['manager', 'facilitator', 'student'] },
            student_id: { type: 'string' },
            faculty_position: { type: 'string' },
            specialization: { type: 'string' }
          }
        },
        UserInput: {
          type: 'object',
          required: ['username', 'email', 'password', 'first_name', 'last_name'],
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);



// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/modules', moduleRoutes);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(5000, () => {
  console.log("Listening on port 5000");
  console.log(`API documentation available at http://localhost:5000/api-docs`);
});