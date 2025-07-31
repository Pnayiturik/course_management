// models/cohort.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';

const Cohort = sequelize.define('Cohort', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
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
    type: DataTypes.ENUM('planned', 'active', 'completed', 'archived'),
    allowNull: false,
    defaultValue: 'planned'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'cohorts'
});

export default Cohort;