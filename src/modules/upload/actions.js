import {
    ADD_UPLOAD,
    UPLOAD_PROGRESS,
    REMOVE_UPLOAD,
} from './action-types';

export const addUpload = (data) => ({
    type: ADD_UPLOAD,
    payload: data,
});

export const uploadProgress = (progressInfo) => ({
    type: UPLOAD_PROGRESS,
    payload: progressInfo,
});

export const removeUpload = (id) => ({
    type: REMOVE_UPLOAD,
    payload: id,
});
