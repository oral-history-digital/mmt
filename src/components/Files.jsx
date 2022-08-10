export default function Files() {
    const uploadFiles = [];
    const downloadFiles = [];

    return (
        <section className="section">
            <h1 className="title is-spaced">Files</h1>

            <h2 className="subtitle">Uploaded files</h2>

            <div className="content">
                <ul>
                    {uploadFiles.map(file => (
                        <li>{file}</li>
                    ))}
                </ul>
            </div>

            <h2 className="subtitle">Downloadable files</h2>

            <div className="content">
                <ul>
                    {downloadFiles.map(file => (
                        <li>
                            <a href="/download?filename={{this.encoded}}" download>
                                {file.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
