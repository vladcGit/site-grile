const express = require('express');
const sequelize = require('./sequelize');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

require('./models/examen_student');
require('./models/examene');
require('./models/intrebare');
require('./models/studenti');
require('./models/varianta');

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/examen', require('./routes/exameneRoutes'));

//admin
const [adminJs, router] = require('./admin/adminPage');
app.use(adminJs.options.rootPath, router);

const port = process.env.PORT;
app.listen(port, async () => {
  // await sequelize.query('PRAGMA foreign_keys = off');
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });
  // await sequelize.query('PRAGMA foreign_keys = on');
  console.log(`Server started on port ${port}`);
});
