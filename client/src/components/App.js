import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from '../util';
import { useMediaQuery } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import SignInSide from './SignIn';
import Album from './Album';
import Examene from './Examene';
import Examen from './Examen';

export default function App() {
  const [mode, setMode] = useState('light');
  const [modifiedTheme, setModifiedTheme] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setModifiedTheme(true);
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        const actualMode = mode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', actualMode);
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: modifiedTheme ? mode : prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [mode, prefersDarkMode, modifiedTheme]
  );

  theme.typography.h3 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Album />} />
            <Route exact path='/signup' element={<Signup />} />
            <Route exact path='/login' element={<SignInSide />} />
            <Route exact path='/examene' element={<Examene />} />
            <Route exact path='/examen/:id' element={<Examen />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
