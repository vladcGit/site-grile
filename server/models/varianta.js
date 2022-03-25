const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Varianta = sequelize.define(
  'Varianta',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagine: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { tableName: 'Variante' }
);
module.exports = Varianta;
