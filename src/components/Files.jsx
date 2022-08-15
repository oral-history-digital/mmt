import classNames from 'classnames';

import useFiles from '../hooks/useFiles';

export default function Files() {
    const { files, error } = useFiles();

    const downloadFiles = [];

    console.log(files);

    return (
        <section className="section">
            <h1 className="title is-spaced">Files</h1>

            <h2 className="subtitle">Uploaded files</h2>

            <table className="table">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Filename</td>
                        <td>Size</td>
                        <td>Type</td>
                        <td>Updated at</td>
                        <td>State</td>
                    </tr>
                </thead>
                <tbody>
                    {files.map(file => (
                        <tr>
                            <td>{file.id}</td>
                            <td>{file.name}</td>
                            <td>{(Math.round(file.size / 1024 / 1024)).toLocaleString()} MB</td>
                            <td>{file.type}</td>
                            <td>{(new Date(file.lastModified)).toLocaleDateString()}</td>
                            <td>
                                <span className={classNames('tag', {
                                    'is-lite': file.state === 'pending',
                                    'is-success': file.state === 'complete',
                                })}>
                                    {file.state}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
