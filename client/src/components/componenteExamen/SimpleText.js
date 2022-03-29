import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function SimpleText({ text }) {
  return (
    <Grid item xs={12} mt='20px'>
      <Typography variant='h3'>{text}</Typography>
    </Grid>
  );
}
