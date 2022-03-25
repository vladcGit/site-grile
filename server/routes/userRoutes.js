const express = require('express');
const app = express();
const Student = require('../models/studenti');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// creare token cu datele din parametru
// nu seteaza un timp de expirare pentru token
const encodeToken = (tokenData) => {
  return jwt.sign(tokenData, process.env.SECRET);
};

//creaza un nou utilizator
app.post('/create', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.parola, 10);
    const instanta = await Student.create({
      email: req.body.email,
      parola: hashedPassword,
    });
    return res.status(201).json(instanta);
  } catch (e) {
    res.status(500).json(e);
  }
});

//primeste datele de autentificare si intoarce un token de acces
app.post('/login', async (req, res) => {
  try {
    const instanta = await Student.findOne({
      where: { email: req.body.email },
      raw: true,
    });
    if (instanta === null)
      return res
        .status(400)
        .json({ error: 'Nu exista utilizatorul cu acest mail' });

    if (await bcrypt.compare(req.body.parola, instanta.parola)) {
      return res.status(200).json({
        message: 'Success',
        token: encodeToken({ userId: instanta.id }),
      });
    } else {
      return res.status(403).json({ error: 'Parola e incorecta' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

module.exports = app;
