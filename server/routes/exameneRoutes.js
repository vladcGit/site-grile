const express = require('express');
const Examen = require('../models/examene');
const ExamenStudent = require('../models/examen_student');
const Intrebare = require('../models/intrebare');
const Varianta = require('../models/varianta');
const { authenticationMiddleware } = require('../util');
const app = express();
require('dotenv').config();

app.get('/', async (req, res) => {
  try {
    const instante = await Examen.findAll();
    res.status(200).json(instante);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get('/:id', async (req, res) => {
  try {
    const instanta = await Examen.findByPk(req.params.id, {
      include: [{ model: Intrebare, include: [Varianta] }],
    });
    if (instanta == null)
      return res.status(404).json({ error: 'Nu exista acest examen' });
    res.status(200).json(instanta);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get('/:id/rezultat', authenticationMiddleware, async (req, res) => {
  try {
    const instanta = await ExamenStudent.findOne({
      where: { id_student: req.userId, id_examen: req.params.id },
    });
    if (instanta == null || instanta.getDataValue('punctaj') < 0) {
      return res.status(200).json({ sustinut: false });
    }
    return res
      .status(200)
      .json({ sustinut: true, punctaj: instanta.getDataValue('punctaj') });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post('/:id/termina', authenticationMiddleware, async (req, res) => {
  try {
    let numarCorecte = 0;
    const examen = await Examen.findByPk(req.params.id);
    const intrebari = await examen.getIntrebares();
    for (let intrebare of intrebari) {
      const raspuns = req.body.raspunsuri.filter(
        (rasp) => rasp.id_intrebare === intrebare.id
      )[0].raspuns;
      if (intrebare.getDataValue('raspuns_corect') === raspuns) numarCorecte++;
    }
    const instanta = await ExamenStudent.findOne({
      where: {
        id_student: req.userId,
        id_examen: req.params.id,
      },
    });
    if (instanta == null) {
      await ExamenStudent.create({
        id_student: req.userId,
        id_examen: req.params.id,
        punctaj: numarCorecte,
        e_platit: false,
      });
    } else await instanta.update({ punctaj: numarCorecte });
    return res.status(200).json({ punctaj: numarCorecte });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get('/:id/e_platit', authenticationMiddleware, async (req, res) => {
  try {
    const instanta = await ExamenStudent.findOne({
      where: { id_student: req.userId, id_examen: req.params.id },
    });
    if (instanta != null && instanta.getDataValue('e_platit')) {
      return res.status(200).json({ e_platit: true });
    }
    return res.status(200).json({ e_platit: false });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = app;
