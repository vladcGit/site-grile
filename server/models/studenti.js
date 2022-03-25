const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const ExamenStudent = require('./examen_student');

const Student = sequelize.define(
  'Studenti',
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
      validate: { isEmail: true },
    },
    parola: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'Studenti' }
);

Student.hasMany(ExamenStudent, {
  foreignKey: 'id_student',
  onDelete: 'CASCADE',
});

module.exports = Student;
