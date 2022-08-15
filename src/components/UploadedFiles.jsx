import classNames from 'classnames';

import useFiles from '../hooks/useFiles';

export default function UploadedFiles() {
    const { files, error } = useFiles();

    console.log(files);

    return (
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
                    <tr key={file.id}>
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
    );
}
