const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const sequelize = require('./sequelize');
const Admin = require('./models/administratori');
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

const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));
app.get('/', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));

//admin
const [adminJs, router] = require('./admin/adminPage');
app.use(adminJs.options.rootPath, router);

const port = process.env.PORT || 3001;
app.listen(port, async () => {
  // await sequelize.query('PRAGMA foreign_keys = off');
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });
  // await sequelize.query('PRAGMA foreign_keys = on');

  //daca nu exista niciun cont de admin se va crea unul default
  if ((await Admin.count()) === 0) {
    await Admin.create({
      email: 'admin',
      parola_criptata: await bcrypt.hash('furbani', 10),
    });
  }

  console.log(`Server started on port ${port}`);
});
