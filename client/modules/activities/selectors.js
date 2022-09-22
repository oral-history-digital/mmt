import { createSelector } from 'reselect';

import { NAME } from './constants';

export const getActivities = state => state[NAME];

export const getNumActivities = createSelector(
  [getActivities],
  activities => {
    // TODO: This should return only ongoing activities.
    return 3;
    return Object.values(activities).length;
  }
);
