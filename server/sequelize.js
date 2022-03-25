const { Sequelize } = require('sequelize');
const {
  NODE_ENV,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = require('dotenv').config().parsed;

/** @type {Sequelize} */
let sequelize;

if (NODE_ENV === 'production') {
  sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    dialect: 'mysql',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',
    database: 'Database',
    logging: false,
  });
}

module.exports = sequelize;
