import {
  ADD_ACTIVITY,
  UPDATE_ACTIVITY,
  REMOVE_ACTIVITY,
  CLEAR_ACTIVITIES,
} from './action-types.js';

export const addActivity = (id, name, type, total, current = 0) => ({
  type: ADD_ACTIVITY,
  payload: {
    id,
    name,
    type,
    total,
    current,
  },
});

export const updateActivity = (id, current) => ({
  type: UPDATE_ACTIVITY,
  payload: {
    id,
    current,
  },
});

export const removeActivity = (id) => ({
  type: REMOVE_ACTIVITY,
  payload: id,
});

export const clearActivities = () => ({ type: CLEAR_ACTIVITIES });
