import {
    LOGIN,
    LOGOUT,
} from './action-types';

export const login = (user) => ({
    type: LOGIN,
    payload: user,
});

export const logout = () => ({
    type: LOGOUT,
});
