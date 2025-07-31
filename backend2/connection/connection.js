import { Sequelize } from 'sequelize';

// Create a new Sequelize instance
const sequelize = new Sequelize('course_management', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false, 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;