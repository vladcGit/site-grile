import React from 'react';
import axios from 'axios';
import { Box, Button, Checkbox, Grid, Typography } from '@mui/material';
import Appbar from './Appbar';
import { useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

export default function Examen() {
  const { id } = useParams();
  const [examen, setExamen] = React.useState(null);
  const [canTake, setCanTake] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [indexIntrebare, setindexIntrebare] = React.useState(0);
  const [intrebare, setintrebare] = React.useState({});
  const [indexRaspuns, setIndexRaspuns] = React.useState({});
  const [punctaj, setPunctaj] = React.useState(-1);
  //   const [raspunsuri,setRaspunsuri] = React.useState([]);
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  const SERVER = process.env.REACT_APP_SERVER_NAME;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${SERVER}/api/examen/${id}`);

        //sortare variante raspuns dupa createdAt
        for (let intrebare of res.data.Intrebares) {
          intrebare.Varianta.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        }

        setExamen(res.data);
        //verifica daca examenul a fost sustinut

        const res2 = await axios.get(`${SERVER}/api/examen/${id}/rezultat`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        if (res2.data.sustinut === true) {
          setFinished(true);
          setPunctaj(res2.data.punctaj);
          return;
        }

        // verifica daca examenul a inceput
        const diffTime = new Date() - new Date(res.data.data_incepere);
        if (diffTime > 0) {
          setCanTake(true);

          //verifica daca la unele intrebari a fost primit raspuns
          const obiect = JSON.parse(localStorage.getItem('examen'));
          if (obiect == null || obiect.id_examen !== res.data.id) {
            //obiect initial
            localStorage.setItem(
              'examen',
              JSON.stringify({
                id_examen: res.data.id,
                raspunsuri: [],
              })
            );
          } else {
            //modificare index intrebare curenta in functie de obiectul din localStorage
            const index = obiect.raspunsuri.length;
            setindexIntrebare(index);
            setintrebare(res.data.Intrebares[index]);
            if (index === res.data.Intrebares.length) setFinished(true);
          }
        }
      } catch (e) {
        const err = e.response;
        if (err.status === 404) {
          alert('Nu exista acest examen');
        } else if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    fetchData();
  }, [SERVER, id]);

  React.useEffect(() => {
    setintrebare(examen?.Intrebares[indexIntrebare]);
  }, [indexIntrebare, examen]);

  const handleSubmit = async () => {
    if (indexIntrebare == null) return alert('Selecteaza un raspuns');
    const obiect = JSON.parse(localStorage.getItem('examen'));
    if (obiect.raspunsuri.length < examen.Intrebares.length) {
      obiect.raspunsuri.push({
        id_intrebare: examen.Intrebares[indexIntrebare].id,
        raspuns: alphabet[indexRaspuns],
      });
      setindexIntrebare(indexIntrebare + 1);
      setIndexRaspuns(null);
      localStorage.setItem('examen', JSON.stringify(obiect));
    }

    if (obiect.raspunsuri.length === examen.Intrebares.length) {
      setFinished(true);
      try {
        const raspunsuri = JSON.parse(
          localStorage.getItem('examen')
        ).raspunsuri;
        console.log(raspunsuri);
        const res = await axios.post(
          `${SERVER}/api/examen/${id}/termina`,
          { raspunsuri },
          { headers: { Authorization: localStorage.getItem('token') } }
        );
        setPunctaj(res.data.punctaj);
      } catch (e) {
        const err = e.response;
        if (err.status === 404) {
          alert('Nu exista acest examen');
        } else if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    }
  };

  const Component = () => (
    <>
      <Grid item xs={12}>
        <CountdownTimer
          targetDate={
            new Date(examen?.data_incepere).getTime() +
            examen.durata * 60 * 1000
          }
        />
      </Grid>

      <Grid item xs={12} mb='40px' textAlign={'center'}>
        <Typography variant='h3' textAlign={'center'}>
          {`Intrebarea ${indexIntrebare + 1}: ${intrebare?.text}`}
        </Typography>
      </Grid>
      {intrebare?.Varianta.map((raspuns, index) => (
        <Grid
          item
          xs={10}
          key={raspuns.id}
          minWidth='70vw'
          display={'flex'}
          justifyContent='center'
          alignItems={'center'}
        >
          <Checkbox
            checked={index === indexRaspuns}
            onChange={() => {
              if (index !== indexRaspuns) setIndexRaspuns(index);
              else setIndexRaspuns(null);
            }}
          />
          <Typography>{`${alphabet[index]}. ${raspuns.text}`}</Typography>
        </Grid>
      ))}
      <Button variant='contained' color='primary' onClick={handleSubmit}>
        Trimite
      </Button>
    </>
  );

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Appbar />
      <Grid
        container
        flexDirection={'column'}
        alignItems='center'
        justifyContent={'center'}
        spacing={5}
      >
        {examen && canTake && !finished && <Component />}
        {finished && (
          <Grid item xs={12}>
            <Typography variant='h3'>
              {punctaj > -1
                ? `Ai obtinut ${punctaj} puncte din ${examen?.Intrebares.length}`
                : 'Examen terminat, se calculeaza punctajul'}
            </Typography>
          </Grid>
        )}
        {examen && !canTake && !finished && <div>Nu</div>}
      </Grid>
    </Box>
  );
}
