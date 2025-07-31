// models/class.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  trimester: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  intake_period: {
    type: DataTypes.ENUM('HT1', 'HT2', 'FT'),
    allowNull: false
  },
  mode: {
    type: DataTypes.ENUM('online', 'in-person', 'hybrid'),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'classes'
});

export default Class;