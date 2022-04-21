const AdminJS = require('adminjs');
const bcrypt = require('bcrypt');
const AdminJSExpress = require('@adminjs/express');
const sequelize = require('../sequelize');
const Admin = require('../models/administratori');
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

const resources = [
  {
    resource: Admin,
    // se ocupa de criptarea si ascunderea parolelor administratorilor
    // codul e copiat din documentatie
    options: {
      properties: {
        parola_criptata: {
          isVisible: false,
        },
        parola: {
          type: 'string',
          isVisible: {
            list: false,
            edit: true,
            filter: false,
            show: false,
          },
        },
      },
      // verifica daca parola introdusa corespunde cu cea din baza de date
      actions: {
        new: {
          before: async (request) => {
            if (request.payload.parola) {
              request.payload = {
                ...request.payload,
                parola_criptata: await bcrypt.hash(request.payload.parola, 10),
                parola: undefined,
              };
            }
            return request;
          },
        },
      },
    },
  },
];

// initializare pagina admin cu modelele din sequelize
const adminJs = new AdminJS({
  databases: [sequelize],
  // ruta la care se afla pagina de admin
  rootPath: '/admin',
  locale,
  branding,
  pages,
  resources,
});

const authenticate = async (email, parola) => {
  const admin = await Admin.findOne({ where: { email: email } });
  if (admin) {
    const matched = await bcrypt.compare(parola, admin.parola_criptata);
    if (matched) {
      return admin;
    }
  }
  return false;
};

// initializare router cu logica de autentificare
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate,
  cookiePassword: 'secret',
});

module.exports = [adminJs, router];
