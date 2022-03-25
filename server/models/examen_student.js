const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const ExamenStudent = sequelize.define(
  'ExamenStudent',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    e_platit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    punctaj: {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      validate: {
        min: -1,
      },
    },
  },
  { tableName: 'examen_student' }
);

module.exports = ExamenStudent;
