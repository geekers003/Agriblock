import {withSnackbar} from 'notistack';

import { Login } from './views';
import { Home } from './views';
import { Transactions } from './views';
import { Deal } from './views';

export const loggedOutUrls = [
    {
        url: '/login',
        component: Login,
        name: 'Sign In'
    }
].map(link => ({
    ...link,
    component: withSnackbar(link.component, link.name)
}));

export const loggedInUrls = [
    {
        url: '/home',
        component: Home,
        name: 'Home'
    },
    {
        url: '/transactions',
        component: Transactions,
        name: 'Transactions'
    },
    {
        url: '/buy',
        component: Deal,
        name: 'Buy'
    }
].map(link => ({
    ...link,
    component: withSnackbar(link.component, link.name)
}));