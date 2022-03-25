import React from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../util';
import Appbar from './Appbar';

export default function HomePage() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Appbar />
        <p>{theme.palette.mode} mode</p>

        <Button
          sx={{ marginTop: '20px' }}
          onClick={colorMode.toggleColorMode}
          color='primary'
          variant='contained'
        >
          Schimba
        </Button>
      </Box>
    </>
  );
}
