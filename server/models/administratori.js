const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const Admin = sequelize.define(
  'Administratori',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parola_criptata: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'Administratori' }
);

module.exports = Admin;
