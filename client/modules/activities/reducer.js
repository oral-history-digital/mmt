import {
  ADD_ACTIVITY,
  UPDATE_ACTIVITY,
  REMOVE_ACTIVITY,
} from './action-types';

const initialState = {};

let clonedState;
const upload = (state = initialState, action) => {
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
    clonedState = {...state};
    delete clonedState[action.payload];
    return clonedState;
  default:
    return state;
  }
};

export default upload;
