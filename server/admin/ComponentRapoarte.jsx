import React, { useState } from 'react';
import { Box, H3, Loader, Input } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const Rapoarte = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [listaProfesori, setListaProfesori] = useState('');

  const downloadResource = async (name) => {
    const res = await api.resourceAction({
      resourceId: name,
      actionName: 'list',
    });
    let resource = res.data.records;
    resource = resource.map((r) => r.params);
    return resource;
  };

  const downloadCsv = (continut) => {
    let csvData = new Blob([continut], { type: 'text/csv' });
    let csvUrl = URL.createObjectURL(csvData);

    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = 'nerepartizati.csv';
    a.click();
  };

  const handleDownloadCereri = async () => {
    setShowLoader(true);
    const cereri = await downloadResource('Cereri');
    const studenti = await downloadResource('Studenti');

    for (let cerere of cereri) {
      const stud = studenti.filter((s) => s.id === cerere.id_student)[0];
      cerere.creator = stud.email;
    }

    const res = await fetch('/cerere/arhiva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cereri }),
    });
    const data = await res.json();

    const a = document.createElement('a');
    a.href = 'data:application/octet-stream;base64,' + data.arhiva;
    a.download = 'cereri.zip';
    a.click();
    setShowLoader(false);
  };

  const handleJsonNerepartizati = async () => {
    setShowLoader(true);

    const specializari = await downloadResource('Specializari');
    let studenti = await downloadResource('Studenti');

    // filtrare studenti nerepartizati
    studenti = studenti.filter((student) => student.e_repartizat === 0);

    // filtrare campuri
    studenti = studenti.map(
      ({ id, e_repartizat, createdAt, updatedAt, ...rest }) => rest
    );

    // legare specializari de studenti
    for (let stud of studenti) {
      if (!stud.id_specializare) {
        stud.specializare = null;
        continue;
      }
      for (let spec of specializari) {
        if (stud.id_specializare === spec.id) stud.specializare = spec.nume;
      }
    }

    //eliminare id_specializare pentru ca avem numele specializarii
    studenti = studenti.map(({ id_specializare, ...rest }) => rest);

    const blob = new Blob([JSON.stringify(studenti)], { type: 'text/json' });

    const a = document.createElement('a');
    a.download = 'nerepartizati.json';
    a.href = window.URL.createObjectURL(blob);
    a.click();

    setShowLoader(false);
  };

  const handleCsvNerepartizati = async () => {
    setShowLoader(true);
    const specializari = await downloadResource('Specializari');
    let studenti = await downloadResource('Studenti');

    // filtrare studenti nerepartizati
    studenti = studenti.filter((student) => student.e_repartizat === 0);

    // legare specializari de studenti
    for (let stud of studenti) {
      if (!stud.id_specializare) {
        stud.specializare = null;
        continue;
      }
      for (let spec of specializari) {
        if (stud.id_specializare === spec.id) stud.specializare = spec.nume;
      }
    }

    let csvContent =
      'email,nume,prenume,grupa,telefon,forma_invatamant,an,an_inmatriculare,id_specializare\n';
    studenti.forEach((student) => {
      let row = `${student.email},${student.nume},${student.prenume},${
        student.grupa || ''
      },${student.telefon || ''},${student.forma_invatamant || ''},${
        student.an || ''
      },${student.an_inmatriculare || ''},${student.id_specializare || ''}`;
      csvContent += row + '\r\n';
    });
    downloadCsv(csvContent);
    setShowLoader(false);
  };

  const handleJsonProfesori = async () => {
    setShowLoader(true);

    const specializari = await downloadResource('Specializari');
    let studenti = await downloadResource('Studenti');
    let profesori = await downloadResource('Profesori');
    let solicitari = await downloadResource('Solicitari');

    // filtrare studenti repartizati
    studenti = studenti.filter((student) => student.e_repartizat === 1);

    //filtrare solicitari acceptate
    solicitari = solicitari.filter((sol) => sol.e_acceptata === 1);

    // legare specializari de studenti
    for (let stud of studenti) {
      if (!stud.id_specializare) {
        stud.specializare = null;
        continue;
      }
      for (let spec of specializari) {
        if (stud.id_specializare === spec.id) stud.specializare = spec.nume;
      }
    }

    // legare specializari de profesori
    for (let prof of profesori) {
      if (!prof.id_specializare) {
        prof.specializare = null;
        continue;
      }
      for (let spec of specializari) {
        if (prof.id_specializare === spec.id) prof.specializare = spec.nume;
      }
    }

    //adaugare camp studenti la profesor
    profesori = profesori.map((prof) => ({ ...prof, studenti: [] }));

    //legare profesori coordonatori de studenti
    for (let sol of solicitari) {
      const prof = profesori.filter((p) => p.id === sol.id_profesor)[0];
      const stud = studenti.filter((s) => s.id === sol.id_student)[0];
      // filtrare campuri
      const {
        id,
        e_repartizat,
        createdAt,
        updatedAt,
        id_specializare,
        ...rest
      } = stud;
      prof.studenti.push(rest);
    }

    //filtrare campuri profesori
    profesori = profesori.map(
      ({
        id,
        id_specializare,
        createdAt,
        updatedAt,
        numar_studenti_maxim,
        ...rest
      }) => rest
    );

    //export json
    const blob = new Blob([JSON.stringify(profesori)], { type: 'text/json' });

    const a = document.createElement('a');
    a.download = 'profesori.json';
    a.href = window.URL.createObjectURL(blob);
    a.click();

    setShowLoader(false);
  };

  const handleProfesoriLiberi = async () => {
    if (listaProfesori.length > 0) {
      setListaProfesori('');
      return;
    }
    const profesori = await downloadResource('Profesori');
    let solicitari = await downloadResource('Solicitari');

    //filtrare solicitari acceptate
    solicitari = solicitari.filter((sol) => sol.e_acceptata === 1);

    profesori.forEach((prof) => {
      const locuriLibere = solicitari.filter(
        (sol) => sol.id_profesor === prof.id
      ).length;
      prof.locuriLibere = prof.numar_studenti_maxim - locuriLibere;
    });
    console.log(profesori);
    const profesoriLiberi = profesori.filter((prof) => prof.locuriLibere > 0);
    let lista = '';
    profesoriLiberi.forEach((prof) => {
      lista += `${prof.nume} - ${prof.prenume.padEnd(30)} ${prof.email.padEnd(
        50
      )} ${prof.locuriLibere} locuri libere\n`;
    });
    console.log(lista);
    setListaProfesori(lista);
  };

  const handleTitluriCereri = async () => {
    let studenti = await downloadResource('Studenti');
    studenti = studenti.filter((stud) => stud.e_repartizat === 1);
    let cereri = await downloadResource('Cereri');
    let csvContent = 'email,titlu\n';
    for (let stud of studenti) {
      const cereriStud = cereri.filter(
        (c) => c.id_student === stud.id && c.e_semnat === 1
      );
      if (cereriStud.length > 0) {
        //sortare descrescatoare dupa data
        const cereriSortate = cereriStud.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        csvContent += `${stud.email},${cereriSortate[0].titlu || ''}\n`;
      }
    }
    downloadCsv(csvContent);
  };

  const createNew = async (name, data) => {
    function paramsToFormData(params) {
      const formData = new FormData(); // Assume that params are flatted

      const isObjectOrArray = (value) =>
        typeof value === 'object' &&
        value.constructor !== File &&
        !(value instanceof Date);

      Object.entries(params).forEach(([key, value]) => {
        // {@link updateRecord} does not change empty objects "{}" - so in order to prevent having
        // them changed to "[object Object]" we have to set them to empty strings.
        if (value === null) {
          return formData.set(key, FORM_VALUE_NULL);
        } // File objects has to go through because they are handled by FormData

        if (isObjectOrArray(value)) {
          if (Array.isArray(value)) {
            return formData.set(key, FORM_VALUE_EMPTY_ARRAY);
          }

          return formData.set(key, FORM_VALUE_EMPTY_OBJECT);
        } // Convert Date fields to UTC timezone

        if (value instanceof Date) {
          return formData.set(key, value.toISOString());
        } // Rest goes as a standard value

        return formData.set(key, value);
      });
      return formData;
    }

    const res = await api.resourceAction({
      resourceId: name,
      data: paramsToFormData(data),
      actionName: 'new',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.record.params;
  };

  const handleImportExamen = (e) => {
    setShowLoader(true);
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const text = reader.result;
        const randuri = text.split('\r\n');
        const examenData = {
          nume: randuri[0],
          descriere: randuri[1],
          data_incepere: randuri[2],
          durata: Number.parseInt(randuri[3]),
        };
        const examen = await createNew('Examene', examenData);
        let i = 4;
        while (i < randuri.length) {
          const text = randuri[i++];
          const raspuns_corect = randuri[i++];
          const intrebareData = { text, raspuns_corect, id_examen: examen.id };
          const intrebare = await createNew('Intrebari', intrebareData);
          const numarVariante = Number.parseInt(randuri[i++]);
          for (let j = 0; j < numarVariante; j++) {
            const text = randuri[i++];
            await createNew('Variante', { text, id_intrebare: intrebare.id });
          }
        }
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Box variant='grey'>
      <Box variant='white' mt='30px'>
        <H3>Import examen din fisier text</H3>
        <Input type={'file'} onChange={handleImportExamen} />
      </Box>

      {showLoader && (
        <div
          style={{
            backgroundColor: 'rgba(204,204,204,0.3)',
            height: '100vh',
            width: '100vw',
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader />
        </div>
      )}
    </Box>
  );
};

export default Rapoarte;
