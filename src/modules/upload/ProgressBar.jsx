export default function ProgressBar({
    id,
    percentage,
    onAbort,
}) {
    return (
        <div
            className="mt-5"
            style={{ display: 'flex', alignItems: 'center'}}
        >
            <div className="mr-5" style={{ flexGrow: 1 }}>
                <p>
                    Uploading file with KiB…
                </p>
                <progress
                    className="progress is-primary mt-3"
                    max={100}
                    value={percentage}
                >
                    {percentage}%
                </progress>
            </div>
            <button
                type="button"
                className="button"
                style={{ marginLeft: 'auto' }}
                onClick={() => onAbort(id)}
            >
                Abort
            </button>
        </div>
    );
}
