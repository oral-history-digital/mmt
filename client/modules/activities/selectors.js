import { createSelector } from 'reselect';

import { NAME } from './constants';

export const getUploads = state => state[NAME];
