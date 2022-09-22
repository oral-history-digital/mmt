import {
  ADD_ACTIVITY,
  UPDATE_ACTIVITY,
  REMOVE_ACTIVITY,
} from './action-types';

export const addActivity = (id, type, total, current = 0) => ({
  type: ADD_ACTIVITY,
  payload: {
    id,
    type,
    total,
    current
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
