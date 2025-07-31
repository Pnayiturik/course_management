// models/manager.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';
import User from './user.model.js';

const Manager = sequelize.define('Manager', {
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
  // Add any manager-specific fields here
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'managers',
  timestamps: false
});

// Define associations
Manager.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Manager, { foreignKey: 'user_id' });

export default Manager;