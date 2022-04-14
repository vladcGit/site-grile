import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Appbar from './Appbar';
import { useNavigate } from 'react-router-dom';

export default function Album() {
  const navigate = useNavigate();
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
              Fii sigur ca intri la ce facultate vrei
            </Typography>
            <Typography
              variant='h5'
              align='center'
              color='text.secondary'
              paragraph
            >
              Acum ai simulari pentru facultate la doar un click distanta. In
              plus, vei primi un raport detaliat a ceea ce ai facut si te vei
              putea compara cu ceilalti care au dat examenul pe platforma.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction='row'
              spacing={2}
              justifyContent='center'
            >
              <Button variant='contained' onClick={() => navigate('/examene')}>
                Urmatoarele simulari
              </Button>
              {!localStorage.getItem('token') && (
                <Button variant='outlined' onClick={() => navigate('/signup')}>
                  Creeaza cont
                </Button>
              )}
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth='md'>
          {/* End hero unit */}
          <Grid container spacing={4}></Grid>
        </Container>
      </main>
    </>
  );
}
