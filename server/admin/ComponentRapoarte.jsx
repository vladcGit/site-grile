import React, { useState } from 'react';
import { Box, H3, Loader, Input } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const Rapoarte = () => {
  const [showLoader, setShowLoader] = useState(false);

  const downloadResource = async (name) => {
    const res = await api.resourceAction({
      resourceId: name,
      actionName: 'list',
    });
    let resource = res.data.records;
    resource = resource.map((r) => r.params);
    return resource;
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
          const raspuns_corect = randuri[i++]?.toLowerCase();
          const intrebareData = { text, raspuns_corect, id_examen: examen.id };
          const intrebare = await createNew('Intrebari', intrebareData);
          const numarVariante = Number.parseInt(randuri[i++]);
          for (let j = 0; j < numarVariante; j++) {
            const text = randuri[i++];
            await createNew('Variante', { text, id_intrebare: intrebare.id });
          }
        }
        setShowLoader(false);
      };
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
      alert('A aparut o eroare');
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
