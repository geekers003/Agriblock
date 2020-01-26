import React, {useRef} from 'react';
import {Avatar, Button, CssBaseline, TextField, Grid, Typography, makeStyles, Container} from '@material-ui/core';
import {NavLink} from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import axios from 'axios'

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
    }
}));

export const Login = props => {
    const classes = useStyles();
    const email = useRef();
    const password = useRef();

    const login = e => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/login/', {
            email: email.current.value,
            password: password.current.value
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => console.log(err))
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    {' '}
                    <AccountCircleIcon color="primary"  />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {' '}
                    Sign in{' '}
                </Typography>
                <form className={classes.form} onSubmit={login} method="POST">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                inputRef={email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                inputRef={password}
                            />
                        </Grid>
                    </Grid>
                    <Button  type="submit" fullWidth variant="contained" className={classes.submit}>
                        {' '}
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
};