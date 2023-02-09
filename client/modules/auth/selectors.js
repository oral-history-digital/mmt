import { createSelector } from 'reselect';

import { NAME } from './constants';

export const getUser = state => state[NAME];

export const getIsLoggedIn = createSelector(
    getUser,
    user => (typeof user === 'object' && user !== null),
);

export const getIsLoggedOut = createSelector(
    getUser,
    user => user === false,
);
