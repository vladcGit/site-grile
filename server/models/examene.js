const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const ExamenStudent = require('./examen_student');
const Intrebare = require('./intrebare');

const Examen = sequelize.define(
  'Examene',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriere: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data_incepere: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durata: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    e_gratis: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { tableName: 'Examene' }
);

Examen.hasMany(ExamenStudent, {
  foreignKey: 'id_examen',
  onDelete: 'CASCADE',
});
Examen.hasMany(Intrebare, {
  foreignKey: 'id_examen',
  onDelete: 'CASCADE',
});

module.exports = Examen;
