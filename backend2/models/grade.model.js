// models/grade.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  formative_one: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  formative_two: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  summative: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  final_grade: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  grade_status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'grades'
});

export default Grade;