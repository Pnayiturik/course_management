// models/student.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';
import User from './user.model.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    unique: true
  },
  student_id: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true
  },
  // Add any other student-specific fields here
  enrollment_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'students',
  timestamps: false
});

// Define associations
Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Student, { foreignKey: 'user_id' });

export default Student;