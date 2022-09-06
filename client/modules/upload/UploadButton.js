import { useTranslation } from 'react-i18next';
import { GrUpload } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { useSWRConfig } from 'swr';

import { filesEndPoint, uploadEndPoint } from '../api';
import { addUpload, uploadProgress, removeUpload } from './actions';
import ProgressBar from './ProgressBar';
import { getUploads } from './selectors';
import registerFiles from './registerFiles';
import useFiles from './useFiles';

const requests = {};

export default function UploadButton() {
    const { t } = useTranslation();
    const { mutate } = useSWRConfig();

    const dispatch = useDispatch();
    const allUploads = useSelector(getUploads);

    async function handleFileChange(event) {
        const files = event.target.files;
        const fileData = [];

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            fileData.push({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
            })
        }

        const ids = await registerFiles(fileData);

        for (let i = 0; i < files.length; i++) {
            addFile(file, ids[i]);
        }

        mutate(filesEndPoint);
    }

    function addFile(file, id) {
        console.log(`uploading file ${id}`);

        const filename = file.name;
        const total = file.size;

        const request = new XMLHttpRequest();
        request.withCredentials = true;

        requests[id] = request;

        dispatch(addUpload({
            id,
            transferred: 0,
            total,
        }));

        request.open('POST', uploadEndPoint);

        const formData = new FormData();
        formData.append('id', id);
        formData.append('files', file, file.name);

        request.addEventListener('load', (event) => {
            // TODO: Should we mark the file as accepted by the server here?
            console.log('transaction completed');
        });

        const uploadObject = request.upload;

        uploadObject.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                dispatch(uploadProgress(id, event.loaded));
            }
        });

        uploadObject.addEventListener('load', (event) => {
            console.log('upload complete');

            mutate(filesEndPoint);

            dispatch(uploadProgress(id, total));
        });

        request.send(formData);

        mutate(filesEndPoint);

        console.log(request);
    }

    function handleAbort(id) {
        requests[id]?.abort();
    }

    return (
        <form className="file is-boxed">
            <label className="file-label">
                <input
                    className="file-input"
                    type="file"
                    name="files"
                    id="file-input"
                    accept="video/*,audio/*"
                    multiple
                    onChange={handleFileChange}
                />
                <span className="file-cta">
                    <span className="file-icon">
                        <GrUpload />
                    </span>
                    <span className="file-label">
                        {t('modules.upload.select_files')}
                    </span>
                </span>
            </label>
        </form>
    );
}
