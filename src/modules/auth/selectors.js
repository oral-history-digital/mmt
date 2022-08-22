import { createSelector } from 'reselect';

import { NAME } from './constants';

export const getUser = state => state[NAME];

export const getIsLoggedIn = createSelector(
    getUser,
    user => user !== null,
);
