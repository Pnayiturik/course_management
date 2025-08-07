# Course Management System

A comprehensive backend API system for managing educational courses, users, cohorts, classes, modules, and grades with real-time notifications and activity logging.

## 🚀 Features

### Core Functionality
- **User Management**: Multi-role system (Student, Facilitator, Manager)
- **Course Management**: Complete CRUD operations for courses, modules, and offerings
- **Cohort & Class Management**: Organize students into cohorts and classes
- **Grade Management**: Track and manage student grades
- **Activity Logging**: Comprehensive audit trail of all system activities
- **Real-time Notifications**: Email and in-app notification system
- **Authentication & Authorization**: JWT-based security with role-based access control

### Technical Features
- **RESTful API**: Well-structured endpoints with proper HTTP methods
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database**: MySQL with Sequelize ORM
- **Caching**: Redis integration for performance optimization
- **Background Jobs**: Bull queue system for async tasks
- **Email Service**: Nodemailer integration for notifications
- **Cron Jobs**: Automated deadline checking and notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **Redis** (v6.0 or higher)
- **pnpm** (v10.7.1 or higher)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course_management/backend2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend2` directory:
   ```env
   # Database Configuration
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=database_development
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here

   # Redis Configuration
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create the database
   mysql -u root -p
   CREATE DATABASE database_development;
   CREATE DATABASE database_test;
   CREATE DATABASE database_production;
   ```

5. **Initialize Database Schema**
   ```bash
   # Import the SQL schema
   mysql -u root -p database_development < quiz_app.sql
   ```

## 🚀 Running the Application

### Development Mode
```bash
pnpm run dev
```

The server will start on `http://localhost:5000`

### Production Mode
```bash
# Build the application (if needed)
pnpm run build

# Start production server
NODE_ENV=production node main.js
```

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **Student**: Can view courses, submit assignments, view grades
- **Facilitator**: Can manage courses, grade assignments, view student progress
- **Manager**: Full system access, can manage all users and courses

## 📁 Project Structure

```
backend2/
├── config/                 # Configuration files
│   ├── config.json        # Database configuration
│   └── redis.js           # Redis configuration
├── connection/            # Database connection
│   └── connection.js      # Sequelize connection setup
├── controllers/           # Business logic
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── cohort.controller.js
│   ├── class.controller.js
│   ├── module.controller.js
│   ├── courseOffering.controller.js
│   ├── grade.controller.js
│   ├── activityLog.controller.js
│   └── notification.controller.js
├── middleware/            # Express middleware
│   ├── auth.js           # Authentication middleware
│   └── config.js         # General middleware setup
├── models/               # Database models
│   ├── index.js          # Model loader
│   ├── associations.js   # Model relationships
│   ├── user.model.js
│   ├── student.model.js
│   ├── facilitator.model.js
│   ├── manager.model.js
│   ├── cohort.model.js
│   ├── class.model.js
│   ├── module.model.js
│   ├── courseOffering.model.js
│   ├── grade.model.js
│   ├── activityLog.model.js
│   └── notification.model.js
├── routes/               # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── cohort.routes.js
│   ├── class.routes.js
│   ├── module.routes.js
│   ├── courseOffering.routes.js
│   ├── grade.routes.js
│   ├── activityLog.routes.js
│   └── notification.routes.js
├── services/             # Business services
│   ├── emailService.js   # Email functionality
│   ├── notificationService.js
│   ├── redis.service.js
│   └── deadlineChecker.js
├── queues/               # Background job queues
│   └── notificationQueue.js
├── workers/              # Background workers
│   └── notificationWorker.js
├── documentation/        # API documentation
│   └── swagger.tags.js
├── main.js              # Application entry point
├── package.json          # Dependencies and scripts
└── quiz_app.sql         # Database schema
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users (Manager only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Manager only)

### Cohorts
- `GET /cohorts` - Get all cohorts
- `POST /cohorts` - Create new cohort
- `GET /cohorts/:id` - Get cohort by ID
- `PUT /cohorts/:id` - Update cohort
- `DELETE /cohorts/:id` - Delete cohort

### Classes
- `GET /classes` - Get all classes
- `POST /classes` - Create new class
- `GET /classes/:id` - Get class by ID
- `PUT /classes/:id` - Update class
- `DELETE /classes/:id` - Delete class

### Modules
- `GET /modules` - Get all modules
- `POST /modules` - Create new module
- `GET /modules/:id` - Get module by ID
- `PUT /modules/:id` - Update module
- `DELETE /modules/:id` - Delete module

### Course Offerings
- `GET /course-offerings` - Get all course offerings
- `POST /course-offerings` - Create new course offering
- `GET /course-offerings/:id` - Get course offering by ID
- `PUT /course-offerings/:id` - Update course offering
- `DELETE /course-offerings/:id` - Delete course offering

### Grades
- `GET /grades` - Get all grades
- `POST /grades` - Create new grade
- `GET /grades/:id` - Get grade by ID
- `PUT /grades/:id` - Update grade
- `DELETE /grades/:id` - Delete grade

### Activity Logs
- `GET /activity-logs` - Get all activity logs
- `POST /activity-logs` - Create new activity log
- `GET /activity-logs/:id` - Get activity log by ID

## 🔧 Configuration

### Database Configuration
The database configuration is located in `config/config.json` and supports three environments:
- **development**: Local development database
- **test**: Testing database
- **production**: Production database

### Redis Configuration
Redis is used for caching and background job queues. Configuration is in `config/redis.js`.

## 📧 Email Notifications

The system includes an email service for sending notifications. Configure your email settings in the `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🔄 Background Jobs

The system uses Bull queues for background processing:
- **Notification Queue**: Handles email and in-app notifications
- **Deadline Checker**: Automated cron jobs for deadline monitoring

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test
```

## 📦 Dependencies

### Core Dependencies
- **express**: Web framework
- **sequelize**: ORM for database operations
- **mysql2**: MySQL driver
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **cors**: Cross-origin resource sharing

### Additional Dependencies
- **bull**: Background job processing
- **redis**: Caching and session storage
- **nodemailer**: Email service
- **node-cron**: Scheduled tasks
- **swagger-jsdoc**: API documentation
- **swagger-ui-express**: Swagger UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the API documentation at `http://localhost:5000/api-docs`
- Review the logs for error messages
- Ensure all prerequisites are properly installed and configured

## 🔄 Updates and Maintenance

- Regularly update dependencies: `pnpm update`
- Monitor Redis and MySQL performance
- Check background job queues for any failed jobs
- Review activity logs for system health

---

**Note**: Make sure to replace placeholder values (like `your_password`, `your_jwt_secret_key_here`, etc.) with actual secure values in your `.env` file.
