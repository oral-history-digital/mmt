import { createSelector } from 'reselect';

import { NAME } from './constants.js';

export const getState = (state) => state[NAME];

function compareActivities(a, b) {
  const isAFinished = a.total === a.current;
  const isBFinished = b.total === b.current;

  if (isAFinished && !isBFinished) {
    return 1;
  } if (isBFinished && !isAFinished) {
    return -1;
  }
  return b.startedAt - a.startedAt;
}

export const getActivities = createSelector(
  [getState],
  (activities) => {
    /* return {
    '632c7335a8a954ec0a58a5f4': {
      id: '632c7335a8a954ec0a58a5f4',
      name: 'dummy-file1.mp4',
      type: 'upload',
      current: 24,
      total: 10000,
      startedAt: new Date(2022, 8, 12),
    },
    '632c7335a8a954ec0a58a333': {
      id: '632c7335a8a954ec0a58a333',
      name: 'dummy-file1.mp4',
      type: 'checksum',
      current: 9000,
      total: 10000,
      startedAt: new Date(2022, 8, 12),
    },
    '632c7335a8a954ec0a58a444': {
      id: '632c7335a8a954ec0a58a444',
      name: 'dummy-file2.mp4',
      type: 'checksum',
      current: 0,
      total: 10000,
      startedAt: new Date(2022, 8, 12),
    },
    '632c7335a8a954ec0a58a555': {
      id: '632c7335a8a954ec0a58a555',
      name: 'dummy-file3.mp4',
      type: 'checksum',
      current: 10000,
      total: 10000,
      startedAt: new Date(2022, 8, 12),
    },
  }; */

    const activityList = Object.values(activities)
      .sort(compareActivities);

    return activityList;
  },
);

export const getNumActivities = createSelector(
  [getState],
  (activities) => {
    // TODO: This should return only ongoing activities.
    const activityList = Object
      .values(activities)
      .filter((activity) => activity.total !== activity.current);

    return activityList.length;
  },
);
