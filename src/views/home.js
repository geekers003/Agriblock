import React, {useState, useEffect, useRef} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Paper from '@material-ui/core/Paper';
import {Dialog, DialogTitle, TextField} from '@material-ui/core'
import axios from 'axios'

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#3f51b5",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
    minWidth: 700,
  },
  button: {
    bottom: "30px",
    right: "40%",
    position: "fixed"

  },
  dialog: {
    width: 500,
    padding: 30
  }
});

export const Home = props => {
  const classes = useStyles();
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(false)
  const name = useRef(null)
  const quantity = useRef(null)
  const price = useRef(null)
  const storage_period = useRef(null)
  const season = useRef(null)
  useEffect(() => {
    axios.post('http://localhost:8000/api/get_assets/', {
      user: localStorage.getItem('email')
    })
    .then(resp => setRows(resp.data.assets))
    .catch(err => console.log(err))
  }, [])
  const reload = () => {
    axios.post('http://localhost:8000/api/issue_asset/', {
      user: localStorage.getItem('email'),
      asset: {
        name: name.current.value,
        quantity: quantity.current.value,
        price: price.current.value,
        storage_period: storage_period.current.value,
        season: season.current.value,
      }
    })
    .then(resp => window.location.reload())
    .catch(err => console.log(err))
  }

  return (
  	<Paper className={classes.root}>
    <TableContainer >
      <Table stickyHeader className={classes.container} aria-label="sticky table">
        <TableHead >
          <TableRow>
            <StyledTableCell>Asset</StyledTableCell>
            <StyledTableCell align="right">Amount recieved</StyledTableCell>
            <StyledTableCell align="right">Recieved From</StyledTableCell>
            <StyledTableCell align="right">Expiry Period (days left)</StyledTableCell>
            <StyledTableCell align="right">Buying Price (per Kg)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.quantity}</StyledTableCell>
              <StyledTableCell align="right">{row.prev_owner ? row.prev_owner.hash : 'NULL'}</StyledTableCell>
              <StyledTableCell align="right">{row.storage_period}</StyledTableCell>
              <StyledTableCell align="right">{row.price}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
     
    </TableContainer>
      <Button onClick={() => setOpen(prev => !prev)}
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<CloudUploadIcon />}
      >
        Add New  data
      </Button>
      <Dialog classes={{paperScrollPaper: classes.dialog}} onClose={() => setOpen(false)} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Add asset</DialogTitle>
        <TextField label="Name" inputRef={name} type="text" />
        <TextField label="Quantity" inputRef={quantity} type="number" />
        <TextField label="Price" inputRef={price} type="number" />
        <TextField label="Storage Period" inputRef={storage_period} type="number" />
        <TextField label="Season" inputRef={season} type="text" />
        <br />
        <Button onClick={reload}
        variant="contained"
        color="default"
        startIcon={<CloudUploadIcon />}>
        Add
        </Button>
      </Dialog>
    </Paper>
  );
}