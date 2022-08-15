import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR, { useSWRConfig } from 'swr';


import useFiles from '../../hooks/useFiles';
import { addUpload, uploadProgress, removeUpload } from './actions';
import ProgressBar from './ProgressBar';
import { getUploads } from './selectors';
import registerFile from './registerFile';

const requests = {};

export default function Upload() {
    const { files, error } = useFiles();
    const { mutate } = useSWRConfig();

    const [progress, setProgress] = useState({});

    const dispatch = useDispatch();
    const allUploads = useSelector(getUploads);

    async function handleFileChange(event) {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            console.log(file);

            const id = await registerFile({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
            });

            mutate('http://localhost:3000/files');

            addFile(file, id);
        }
    }

    function addFile(file, id) {
        console.log(`uploading file ${id}`);

        const filename = file.name;
        const total = file.size;

        const request = new XMLHttpRequest();

        requests[id] = request;

        setProgress(prev => ({
            ...prev,
            [id]: 0,
        }));

        request.open('POST', 'http://localhost:3000/upload');

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
                setProgress(prev => ({
                    ...prev,
                    [id]: event.loaded,
                }));

                //dispatch(uploadProgress({
                //    value: event.loaded,
                //    percentage: Math.round(100 / event.total * event.loaded),
                //}));
            }
        });

        uploadObject.addEventListener('load', (event) => {
            console.log('upload complete');

            setProgress(prev => ({
                ...prev,
                [id]: total,
            }));
        });

        request.send(formData);

        console.log(request);
    }

    function abortUpload(id) {
        allUploads[id].request.abort();
        dispatch(removeUpload(id));
    }

    if (!files) {
        return null;
    }

    return (
        <section className="section">
            <h1 className="title">Upload files</h1>

            <form method="post" action="/upload" encType="multipart/form-data">
                <div className="file">
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
                                <i className="fas fa-upload"></i>
                            </span>
                            <span className="file-label">
                                Choose files…
                            </span>
                        </span>
                    </label>
                </div>
            </form>

            {Object.keys(progress).map(id => {
                console.log(progress, files);

                const file = files.find(file => file.id === Number.parseInt(id));
                if (!file) {
                    return null;
                }

                console.log(files, id);
                const percentage = 100 / file.size * progress[id];

                return (
                    <ProgressBar
                        key={id}
                        id={id}
                        percentage={percentage}
                    />
                );
            })}
        </section>
    );
}
