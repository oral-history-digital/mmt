import {
  ADD_ACTIVITY,
  UPDATE_ACTIVITY,
  REMOVE_ACTIVITY,
  CLEAR_ACTIVITIES
} from './action-types';

const initialState = {};

const upload = (state = initialState, action) => {
  let newState;

  switch (action.type) {
  case ADD_ACTIVITY:
    return {
      ...state,
      [action.payload.id]: {
        ...action.payload,
        startedAt: new Date(),
      },
    };

  case UPDATE_ACTIVITY:
    const activity = state[action.payload.id];
    return {
      ...state,
      [action.payload.id]: {
        ...activity,
        current: action.payload.current,
      },
    };

  case REMOVE_ACTIVITY:
    newState = {...state};
    delete newState[action.payload];
    return newState;

  case CLEAR_ACTIVITIES:
    newState = {};
    for (const [key, value] of Object.entries(state)) {
      if (value.current !== value.total) {
        newState[key] = value;
      }
    }
    return newState;

  default:
    return state;
  }
};

export default upload;
