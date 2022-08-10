import { useState } from 'react';

export default function Upload() {
    const [upload, setUpload] = useState(null);

    function handleFileChange(event) {
        const files = event.target.files;
        const firstFile = files[0];


        const filename = firstFile.name;
        const total = firstFile.size;
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
        formData.append('files', firstFile, firstFile.name);

        req.addEventListener('load', (event) => {
            console.log('transaction completed');
        });

        req.addEventListener('progress', (event) => {
            // The progress event is for the response!
        });

        const uploadObject = req.upload;

        console.log(uploadObject);

        uploadObject.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                setUpload(prev => ({
                    ...prev,
                    value: event.loaded,
                    percentage: Math.round(100 / event.total * event.loaded),
                }));
            }
        });

        uploadObject.addEventListener('load', (event) => {
            console.log('upload complete');

            setUpload(null);
        });

        setUpload(preparedUpload);

        req.send(formData);

        console.log(req);
    }

    function abortUpload() {
        upload.request.abort();
        setUpload(null);
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

            {upload && (
                <div
                    id="progress-bar-container"
                    className="mt-5"
                    style={{ display: 'flex', alignItems: 'center'}}
                >
                    <div className="mr-5" style={{ flexGrow: 1 }}>
                        <p>
                            Uploading file <b>{upload.filename}</b> with {upload.sizeInKb.toLocaleString()}KiB…
                        </p>
                        <progress
                            className="progress is-primary mt-3"
                            max={upload.total}
                            value={upload.value}
                        >
                            {upload.percentage}%
                        </progress>
                    </div>
                    <button
                        type="button"
                        className="button"
                        style={{ marginLeft: 'auto' }}
                        onClick={abortUpload}
                    >
                        Abort
                    </button>
                </div>
            )}
        </section>
    );
}
