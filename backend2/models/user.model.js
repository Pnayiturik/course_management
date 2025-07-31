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
  // Common fields for all roles
  first_name: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  // Student-specific fields (nullable for other roles)
  student_id: {
    type: DataTypes.STRING(250),
    allowNull: true,
    unique: true
  },
  // Facilitator-specific fields (nullable for other roles)
  faculty_position: {
    type: DataTypes.STRING(250),
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'users',
  // Add scopes for different roles
  defaultScope: {
    attributes: { exclude: ['password_hash'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password_hash'] }
    },
    managers: {
      where: { role: 'manager' }
    },
    facilitators: {
      where: { role: 'facilitator' }
    },
    students: {
      where: { role: 'student' }
    }
  }
});

export default User;