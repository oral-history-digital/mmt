export default function ProgressBar({
    upload,
    onAbort,
}) {
    return (
        <div
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
                onClick={() => onAbort(upload.id)}
            >
                Abort
            </button>
        </div>
    );
}
