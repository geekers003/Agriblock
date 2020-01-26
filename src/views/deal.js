import React, {useRef, useState, useEffect} from 'react';
import {Avatar, Button, CssBaseline, TextField, Grid, Typography, makeStyles, Container} from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {TableContainer, TableCell, TableRow, TableBody, Paper, Table, TableHead, Dialog, DialogTitle, Select, MenuItem} from '@material-ui/core'
import axios from 'axios'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
    },
    avatar: {
        margin: theme.spacing(1),
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3)
    },
    margin: {
        marginBottom: '20px',
    },
    dialog: {
        width: 500,
        padding: 30
    }
}));
export const Deal = props => {
    const classes = useStyles();
    const dealer = useRef(null)
    const [assets, setAssets] = useState([])
    const [open, setOpen] = useState(false)
    const name = useRef(null)
    const quantity = useRef(null)
    const [owners, setOwners] = useState(new Set())
    const [prevOwner, setPrevOwner] = useState('')
    const getDealer = () => {
        axios.post('http://localhost:8000/api/get_assets/', {
            user: localStorage.getItem('email'),
            dealer: dealer.current.value
        })
        .then(resp => setAssets(resp.data.assets))
        .catch(err => props.enqueueSnackbar(err.response.error, {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000
        }))
    }
    useEffect(() => {
        let prevOwners = new Set();
        assets.forEach(asset => {
            prevOwners.add(asset.owner.email)
        })
        setOwners(prevOwners)
    }, [assets])
    const reload = () => {
        axios.post('http://localhost:8000/api/buy/', {
          user: localStorage.getItem('email'),
          name: name.current.value,
          quantity: quantity.current.value,
          seller: prevOwner
        })
        .then(resp => window.location.reload(false))
        .catch(err => {
            console.log(err)
        })
    }
    const handleChange = e => setPrevOwner(e.target.value)
    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <MonetizationOnIcon color="primary"  />
                </Avatar>
            </div>
            <br />
            <br />
            <FormControl className={classes.margin}>
                <InputLabel htmlFor="input-with-icon-adornment">Your dealer id</InputLabel>
                <Input
                    id="input-with-icon-adornment"
                    inputRef={dealer}
                    startAdornment={
                    <InputAdornment position="start">
                        <AccountCircle />
                    </InputAdornment>
                }/>
            </FormControl>
            <br />
            <Button type="submit" variant="contained" className={classes.submit}  onClick={getDealer}>Search</Button>
            <br />
            <br />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Expiry Period</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {assets.map(row => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.storage_period}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
                {assets.length > 0 && (
                <Button onClick={() => setOpen(prev => !prev)}
                    variant="contained"
                    color="default"
                    className={classes.button}
                    startIcon={<CloudUploadIcon />}>
                    Buy assets
                </Button>
                )}
                <Dialog classes={{paperScrollPaper: classes.dialog}} onClose={() => setOpen(false)} aria-labelledby="simple-dialog-title" open={open}>
                    <DialogTitle id="simple-dialog-title">Buy assets</DialogTitle>
                    <TextField label="Name" inputRef={name} type="text" />
                    <TextField label="Quantity" inputRef={quantity} type="number" />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Prev Owner</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={prevOwner}
                            onChange={handleChange}
                            >
                                {
                                    Array.from(owners).map((owner, index) => (
                                        <MenuItem value={owner}>{owner}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    <br />
                    <Button onClick={reload}
                    variant="contained"
                    color="default"
                    startIcon={<CloudUploadIcon />}>
                    Add
                    </Button>
                </Dialog>
        </Container>
    );
};