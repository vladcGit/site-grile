import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export default function BasicTable(props) {
  const { columns, rows, highlightColor, predicatHighlight } = props;
  const removeProperty = (object, property) => {
    const copie = { ...object };
    delete copie[property];
    return copie;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '50vw' }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{columns[0]}</TableCell>
            {columns.slice(1).map((column) => (
              <TableCell key={column} align='right'>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: predicatHighlight(row)
                  ? highlightColor
                  : 'inherit',
              }}
              hover
            >
              <TableCell component='th' scope='row'>
                {index + 1}
              </TableCell>
              {Object.keys(removeProperty(row, 'id')).map(
                (keyName, indexCol) => (
                  <TableCell
                    key={`rand ${index} coloana ${indexCol}`}
                    align='right'
                  >
                    {row[keyName]}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
