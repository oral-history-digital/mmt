export default function Upload() {
    return (
        <section className="section">
            <h1 className="title">Upload files</h1>

            <form method="post" action="/upload" encType="multipart/form-data">
                <div className="file">
                    <label className="file-label">
                        <input className="file-input" type="file" name="files"
                            id="file-input" accept="video/*,audio/*" />
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

            <div id="progress-bar-container" className="mt-5" style={{ display: 'flex', alignItems: 'center'}}>
            </div>
        </section>
    );
}
