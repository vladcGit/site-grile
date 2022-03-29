const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const sequelize = require('../sequelize');
require('dotenv').config();

const secret = process.env.SECRET;

AdminJS.registerAdapter(require('@adminjs/sequelize'));

// override la mesajele default din adminjs
const locale = {
  translations: {
    labels: {
      loginWelcome: 'Bine ai venit',
    },
    messages: {
      loginWelcome: 'Grile medicina',
    },
  },
};

const branding = {
  companyName: 'Grile',
  // ascunde sigla autorilor
  softwareBrothers: false,
  //   logo: '/logo.png',
};

const pages = {
  Operatii: {
    label: 'Operatii',
    component: AdminJS.bundle('./ComponentRapoarte'),
  },
};

// initializare pagina admin cu modelele din sequelize
const adminJs = new AdminJS({
  databases: [sequelize],
  // ruta la care se afla pagina de admin
  rootPath: '/admin',
  locale,
  branding,
  pages,
});

// initializare router cu logica de autentificare
const router = AdminJSExpress.buildRouter(adminJs);

module.exports = [adminJs, router];
