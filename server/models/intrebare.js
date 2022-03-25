const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const Varianta = require('./varianta');

const Intrebare = sequelize.define(
  'Intrebare',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagine: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    raspuns_corect: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        isIn: [['a', 'b', 'c', 'd', 'e']],
      },
    },
  },
  { tableName: 'Intrebari' }
);
Intrebare.hasMany(Varianta, {
  foreignKey: 'id_intrebare',
  onDelete: 'CASCADE',
});
module.exports = Intrebare;
