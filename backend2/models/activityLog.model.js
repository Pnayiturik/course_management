// models/activityLog.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  week_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attendance: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  formative_one_grading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  formative_two_grading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  summative_grading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  course_moderation: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  intranet_sync: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  gradebook_status: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'activity_logs'
});

export default ActivityLog;