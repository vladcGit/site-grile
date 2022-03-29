import React from 'react';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import BasicTable from '../BasicTable';
import Appbar from '../Appbar';

export default function ClasamentExamen() {
  const [lista, setLista] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const { id } = useParams();
  const theme = useTheme();

  const secondaryColor = theme.palette.warning.main;

  React.useEffect(() => {
    const fetchData = async () => {
      const SERVER = process.env.REACT_APP_SERVER_NAME;

      const res = await axios.get(`${SERVER}/api/examen/${id}/clasament`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      console.log(res.data);
      setLista(res.data);

      const resUser = await axios.get(`${SERVER}/api/user`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      setUser(resUser.data);
      console.log(resUser.data);
    };
    fetchData();
  }, [id]);

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
        justifyContent={'flex-start'}
        alignItems='center'
        flexDirection={'column'}
      >
        <Grid item xs={10} mt='20px'>
          {lista && user && (
            <BasicTable
              columns={['Pozitie', 'Punctaj', 'Id student']}
              rows={lista}
              highlightColor={secondaryColor}
              predicatHighlight={(row) => row.id_student === user.id}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
