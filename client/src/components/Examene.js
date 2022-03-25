import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Appbar from './Appbar';
import axios from 'axios';
import TimpPanaLa from './TimpPanaLa';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../util';

export default function Examene() {
  const SERVER = process.env.REACT_APP_SERVER_NAME;
  const [examene, setExamene] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${SERVER}/api/examen/`);
        setExamene(res.data);
      } catch (e) {
        const err = e.response;
        if (err.status === 500) {
          alert('A aparut o eroare');
        }
      }
    };
    fetchData();
  }, [SERVER]);
  return (
    <>
      <CssBaseline />
      <Appbar />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth='sm'>
            <Typography
              component='h1'
              variant='h2'
              align='center'
              color='text.primary'
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography
              variant='h5'
              align='center'
              color='text.secondary'
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth='md'>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {examene.map((examen) => {
              return (
                <Grid item key={examen.id} xs={12} sm={6} md={12}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant='h3' component='h2'>
                        {examen.nume}
                      </Typography>
                      <Typography>{examen.descriere}</Typography>

                      {/* <Timer targetDate={examen.data_incepere} /> */}
                      {/* <TimpPanaLa data={examen.data_incepere} /> */}
                      {formatDate(new Date(examen.data_incepere))}
                    </CardContent>
                    <CardActions>
                      <Button
                        size='large'
                        onClick={() => navigate(`/examen/${examen.id}`)}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </main>
    </>
  );
}
