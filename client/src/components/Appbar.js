import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ThemeSwitch from './ThemeSwitch';
import { useNavigate } from 'react-router-dom';

export default function Appbar() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            sx={{ mr: 2 }}
            onClick={() => navigate(1)}
          >
            <ArrowForwardIcon />
          </IconButton>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
          ></Typography>

          <ThemeSwitch />
          {!localStorage.getItem('token') && (
            <Button color='inherit' onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
          {localStorage.getItem('token') && (
            <Button
              color='inherit'
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
