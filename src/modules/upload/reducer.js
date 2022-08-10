import {
    ADD_UPLOAD,
    UPLOAD_PROGRESS,
    REMOVE_UPLOAD,
} from './action-types';

let nextId = 0;

function createId() {
    return nextId++;
}

const initialState = {};

const upload = (state = initialState, action) => {
    switch (action.type) {
        case ADD_UPLOAD:
            const id = createId();
            return {
                ...state,
                [id]: {
                    ...action.payload,
                    id,
                },
            };
        default:
            return state;
    }
};

export default upload;
