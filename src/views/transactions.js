import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {} from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles({
	root: {
		width: '100%',
	},
	container: {
		maxHeight: 440,
		minWidth: 700,
		marginTop: "30px" 
	},
});

export const Transactions = props => {
	const classes = useStyles();
	const [state, setState] = useState({
		sent: [],
		received: []
	})
	useEffect(() => {
		axios.post('http://localhost:8000/api/get_transactions/', {
		user: localStorage.getItem('email')
	})
	.then(resp => setState(resp.data))
	.catch(err => console.log(err))
	}, [])
	return (
		<Paper className={classes.root}>
		<h1> Sent </h1>
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
				{state.sent.map(row => (
					<TableRow key={row.name}>
						<TableCell component="th" scope="row">
							{row.asset.name}
						</TableCell>
						<TableCell align="right">{row.asset.quantity}</TableCell>
						<TableCell align="right">{row.asset.price}</TableCell>
						<TableCell align="right">{row.asset.storage_period}</TableCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
		</TableContainer>
			<h1> Recieved </h1>
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
				{state.received.map(row => (
					<TableRow key={row.name}>
						<TableCell component="th" scope="row">
							{row.asset.name}
						</TableCell>
						<TableCell align="right">{row.asset.quantity}</TableCell>
						<TableCell align="right">{row.asset.price}</TableCell>
						<TableCell align="right">{row.asset.storage_period}</TableCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
		</TableContainer>
		</Paper>
	);
}