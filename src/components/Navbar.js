import React, {useState} from 'react';
import {
    AppBar,
    CssBaseline,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography,
    makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import {NavLink} from 'react-router-dom';

import {primColors, secColors} from '../colors';
import { loggedInUrls } from '../urls';

//icons

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0
        }
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        }
    },
    toolbar: {
        ...theme.mixins.toolbar,
        textAlign: 'center'
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    tab: {
        textDecoration: 'none',
        boxShadow: `0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)`,
        textTransform: 'uppercase',
        borderRadius: 4
    },
    activeTab: {
        color: primColors.light,
        backgroundColor: secColors.main,
        '&:hover': {
            color: secColors.main,
            backgroundColor: primColors.light
        }
    },
    list: {
        padding: 0
    },
    name: {
        paddingTop: 15
    }
}));

export const Navbar = props => {
    const {tabs, value, setValue} = props;
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        if (window.innerWidth > 500) return;
        setMobileOpen(!mobileOpen);
        console.log(mobileOpen);
    };

    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <Typography variant="h6" className={classes.name}>{tabs[0] == loggedInUrls[0] ? localStorage.getItem('email') : ''}</Typography>
            </div>
            <List className={classes.list}>
                {tabs.map((tab, index) => (
                    <NavLink
                        key={index}
                        variant="body2"
                        className={classes.tab}
                        to={tab.url}
                        onClick={() => {
                            setValue(index);
                            handleDrawerToggle();
                        }}>
                        <ListItem
                            button
                            key={'text'}
                            value={index}
                            className={index === value ? classes.activeTab : null}>
                            <ListItemText primary={tab.name} />
                        </ListItem>
                    </NavLink>
                ))}
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        AgriBlock
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor="left"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true
                        }}>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        variant="permanent"
                        open>
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>
        </div>
    );
};