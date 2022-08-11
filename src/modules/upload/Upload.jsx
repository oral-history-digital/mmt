import { useDispatch, useSelector } from 'react-redux';

import { addUpload, uploadProgress, removeUpload } from './actions';
import ProgressBar from './ProgressBar';
import { getUploads } from './selectors';

async function registerFile(data) {
    const res = await fetch('http://localhost:3000/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return res.json();
}


export default function Upload() {
    const dispatch = useDispatch();
    const allUploads = useSelector(getUploads);

    function handleFileChange(event) {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            console.log(file);
            registerFile({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
            });
            //addFile(file);
        }
    }

    function addFile(file) {
        const filename = file.name;
        const total = file.size;
        const sizeInKb = Math.round(total / 1024);

        const req = new XMLHttpRequest();

        const preparedUpload = {
            request: req,
            filename,
            value: 0,
            percentage: 0,
            total,
            sizeInKb,
        };

        req.open('POST', 'http://localhost:3000/upload');

        const formData = new FormData();
        formData.append('files', file, file.name);

        req.addEventListener('load', (event) => {
            console.log('transaction completed');
        });

        req.addEventListener('progress', (event) => {
            // The progress event is for the response!
        });

        const uploadObject = req.upload;

        uploadObject.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                //dispatch(uploadProgress({
                //    value: event.loaded,
                //    percentage: Math.round(100 / event.total * event.loaded),
                //}));
            }
        });

        uploadObject.addEventListener('load', (event) => {
            console.log('upload complete');

            //dispatch(removeUpload(0));
        });

        req.send(formData);
        dispatch(addUpload(preparedUpload));

        console.log(req);
    }

    function abortUpload(id) {
        allUploads[id].request.abort();
        dispatch(removeUpload(id));
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

            {Object.values(allUploads).map(upload => (
                <ProgressBar key={upload.id} upload={upload} />
            ))}
        </section>
    );
}
