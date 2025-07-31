// models/user.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('manager', 'facilitator', 'student'),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(250),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'users',
  defaultScope: {
    attributes: { exclude: ['password_hash'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password_hash'] }
    }
  }
});

export default User;