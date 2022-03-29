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
      if (raspuns && intrebare.getDataValue('raspuns_corect') === raspuns)
        numarCorecte++;
    }
    const instanta = await ExamenStudent.findOne({
      where: {
        id_student: req.userId,
        id_examen: req.params.id,
      },
    });
    const raspunsuri = req.body.raspunsuri.map((rasp) => rasp.raspuns).join('');
    if (instanta == null) {
      await ExamenStudent.create({
        id_student: req.userId,
        id_examen: req.params.id,
        punctaj: numarCorecte,
        e_platit: false,
        raspunsuri,
      });
    } else await instanta.update({ punctaj: numarCorecte, raspunsuri });
    return res.status(200).json({ punctaj: numarCorecte, raspunsuri });
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

app.get('/:id/raspunsuri', authenticationMiddleware, async (req, res) => {
  try {
    const instanta = await ExamenStudent.findOne({
      where: { id_student: req.userId, id_examen: req.params.id },
    });

    if (instanta == null || instanta.getDataValue('punctaj') < 0) {
      return res.status(400).json('Examenul nu a fost sustinut');
    }

    const examen = await Examen.findByPk(req.params.id);
    const intrebari = await examen.getIntrebares();

    const listaId = intrebari.map((intreb) => intreb.id);
    const raspCorecte = intrebari.map((intreb) => intreb.raspuns_corect);
    const raspTrimise = instanta.getDataValue('raspunsuri');

    // intorc id-ul intrebarii
    const lista = [];
    for (let i = 0; i < intrebari.length; i++) {
      lista.push({
        id: listaId[i],
        trimis: raspTrimise[i],
        corect: raspCorecte[i],
      });
    }

    return res.status(200).json(lista);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

app.get('/:id/clasament', authenticationMiddleware, async (req, res) => {
  try {
    let instante = await ExamenStudent.findAll({
      where: { id_examen: req.params.id },
      raw: true,
      order: [['punctaj', 'DESC']],
    });
    const examen = await Examen.findByPk(req.params.id);

    //data incepere
    const data_inceput = new Date(examen.getDataValue('data_incepere'));

    // durata in minute
    const durata = examen.getDataValue('durata') * 60 * 1000;

    if (data_inceput.getTime() + durata > new Date().getTime())
      return res.status(400).json('Examenul nu s-a terminat inca');

    instante = instante.map(
      ({ id_examen, createdAt, updatedAt, raspunsuri, e_platit, ...rest }) =>
        rest
    );

    return res.status(200).json(instante);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = app;
