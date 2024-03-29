import { Box, Grid, Typography } from '@mui/material';

import React from 'react';
import Appbar from './Appbar';

export default function Paywall() {
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
        justifyContent={'center'}
        alignItems='center'
        minHeight={'80vh'}
      >
        <Grid item xs={12} textAlign='center' padding={'20px'}>
          <Typography variant='h3' mb='40px'>
            Pentru a sustine acest examen trebuie sa platesti 80 de lei in
            contul:
          </Typography>
          <Typography variant='h3'>RO48CECEB00030RON2163195</Typography>
          <Typography variant='h3'>Rtx Sutures srl</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
