// models/courseOffering.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';

const CourseOffering = sequelize.define('CourseOffering', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('planned', 'active', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'planned'
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  current_enrollment: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'course_offerings'
});

export default CourseOffering;