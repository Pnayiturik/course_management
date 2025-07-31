// models/facilitator.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';
import User from './user.model.js';

const Facilitator = sequelize.define('Facilitator', {
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
  faculty_position: {
    type: DataTypes.STRING(250),
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  // Add any other facilitator-specific fields here
  office_location: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'facilitators',
  timestamps: false
});

// Define associations
Facilitator.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Facilitator, { foreignKey: 'user_id' });

export default Facilitator;