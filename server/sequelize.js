const { Sequelize } = require('sequelize');

/** @type {Sequelize} */
let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
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
