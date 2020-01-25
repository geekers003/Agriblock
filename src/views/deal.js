import React, {useRef, useState} from 'react';
import {Avatar, Button, CssBaseline, TextField, Grid, Typography, makeStyles, Container} from '@material-ui/core';
import {NavLink} from 'react-router-dom';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import OutlinedInput from '@material-ui/core/OutlinedInput';

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
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        transition: '0.3s',
    },
    margin: {
        marginBottom: '20px'
    }
}));
export const Deal = props => {
    const classes = useStyles();
    const email = useRef();
    const password = useRef();
    const [creating, setcreating] = useState(false);
    const [bool , setBool] = useState(0);

    const [values, setValues] = React.useState({
    amount: '',
  });

 function reload() {
    window.location.reload(false);
}

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(values.amount);
  };

var details = bool ==1 ? <div> <div> amount selling : something something </div> <div>  price per kg : something something </div>  </div> : null;
var ord = bool == 0 ? "Submit" : "Order";
    const login = e => {
        e.preventDefault();
    };
   
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    {' '}
                    <MonetizationOnIcon color="primary"  />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {' '}
                    Deal{' '}
                </Typography>
                <div> 
                <h1 style = {{textAlign: 'center'}}> Order </h1> 
                <FormControl className={classes.margin}>
                    <InputLabel htmlFor="input-with-icon-adornment">Your dealer id</InputLabel>
                    <Input
                      id="input-with-icon-adornment"
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                  } />
      </FormControl>
      <div> {details} </div>

      <Button  type="submit" fullWidth variant="contained" className={classes.submit}  onClick = {()=> setBool(prev => !prev) }>
                        {' '}
                        {ord}
                    </Button>
      </div>
                <Divider />
                <div>
                <h1> Your Current State </h1>
                <div style = {{marginBottom: "20px"}}> value per kg: {values.amount}/- per kg </div>
                <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={values.amount}
            onChange={() => handleChange('amount')}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            labelWidth={60}
          />
        </FormControl>
        <Button onClick={reload}
        color = "warning">
        Finalise
      </Button>
                </div>
               
            </div>
            
        </Container>
    );
};