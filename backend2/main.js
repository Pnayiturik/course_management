import express from 'express';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import setupMiddleware from './middleware/config.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import cohortRoutes from './routes/cohort.routes.js';
import classRoutes from './routes/class.routes.js';
import moduleRoutes from './routes/module.routes.js';
import swaggerTags from './documentation/swagger.tags.js';
import courseOfferingRoutes from './routes/courseOffering.routes.js';
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
    tags: swaggerTags,
    components: {
      schemas: {
        // Base user properties common to all roles
        UserBase: {
          type: 'object',
          required: ['username', 'email', 'password', 'first_name', 'last_name'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 250,
              example: 'john_doe'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 100,
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'securePassword123'
            },
            first_name: {
              type: 'string',
              maxLength: 250,
              example: 'John'
            },
            last_name: {
              type: 'string',
              maxLength: 250,
              example: 'Doe'
            }
          }
        },

        // Student specific schema
        StudentInput: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              required: ['student_id'],
              properties: {
                student_id: {
                  type: 'string',
                  maxLength: 50,
                  example: 'STU20230001'
                }
              }
            }
          ]
        },

        // Facilitator specific schema
        FacilitatorInput: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                faculty_position: {
                  type: 'string',
                  maxLength: 250,
                  example: 'Assistant Professor'
                },
                specialization: {
                  type: 'string',
                  maxLength: 200,
                  example: 'Computer Science'
                }
              }
            }
          ]
        },

        // Manager specific schema
        ManagerInput: {
          allOf: [
            { $ref: '#/components/schemas/UserBase' },
            {
              type: 'object',
              properties: {
                department: {
                  type: 'string',
                  maxLength: 100,
                  example: 'IT Department'
                }
              }
            }
          ]
        },

        // Complete user response schema
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            username: {
              type: 'string',
              example: 'john_doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['manager', 'facilitator', 'student'],
              example: 'student'
            },
            first_name: {
              type: 'string',
              example: 'John'
            },
            last_name: {
              type: 'string',
              example: 'Doe'
            },
            // Student specific fields
            student_id: {
              type: 'string',
              nullable: true,
              example: 'STU20230001'
            },
            // Facilitator specific fields
            faculty_position: {
              type: 'string',
              nullable: true,
              example: 'Assistant Professor'
            },
            specialization: {
              type: 'string',
              nullable: true,
              example: 'Computer Science'
            },
            // Manager specific fields
            department: {
              type: 'string',
              nullable: true,
              example: 'IT Department'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T12:00:00Z'
            }
          }
        },

        // Authentication response schema
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },

        // Error response schema
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Validation error detail 1', 'Validation error detail 2']
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
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
app.use('/cohorts', cohortRoutes);
app.use('/classes', classRoutes);
app.use('/modules', moduleRoutes);
app.use('/course-offerings', courseOfferingRoutes);
// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(5000, () => {
  console.log("Listening on port 5000");
  console.log(`API documentation available at http://localhost:5000/api-docs`);
});