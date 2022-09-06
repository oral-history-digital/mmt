import {
    ADD_UPLOAD,
    UPLOAD_PROGRESS,
    REMOVE_UPLOAD,
} from './action-types';

const initialState = {};

const upload = (state = initialState, action) => {
    switch (action.type) {
    case ADD_UPLOAD:
        return {
            ...state,
            [action.payload.id]: action.payload,
        };
    case UPLOAD_PROGRESS:
        const item = state[action.payload.id];
        return {
            ...state,
            [action.payload.id]: {
                ...item,
                transferred: action.payload.transferredBytes,
            },
        };
    default:
        return state;
    }
};

export default upload;
