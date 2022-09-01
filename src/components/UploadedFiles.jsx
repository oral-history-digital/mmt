import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import useFiles from '../hooks/useFiles';

export default function UploadedFiles() {
    const { files, error } = useFiles();

    const { t } = useTranslation();

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="table">
                <thead>
                    <tr>
                        <td>{t('modules.files.table.id')}</td>
                        <td>{t('modules.files.table.filename')}</td>
                        <td>{t('modules.files.table.size')}</td>
                        <td>{t('modules.files.table.type')}</td>
                        <td>{t('modules.files.table.updated_at')}</td>
                        <td>{t('modules.files.table.state')}</td>
                        <td>{t('modules.files.table.checksum')}</td>
                    </tr>
                </thead>
                <tbody>
                    {files.map(file => (
                        <tr key={file._id}>
                            <td>{file._id}</td>
                            <td>{file.name}</td>
                            <td>{(Math.round(file.size / 1024 / 1024)).toLocaleString()} MB</td>
                            <td>{file.type}</td>
                            <td>{(new Date(file.lastModified)).toLocaleDateString()}</td>
                            <td>
                                <span className={classNames('tag', {
                                    'is-lite': file.state === 'pending',
                                    'is-warning': file.state === 'uploading',
                                    'is-success': file.state === 'complete',
                                })}>
                                    {t(`modules.files.states.${file.state}`)}
                                </span>
                            </td>
                            <td>{file.checksum}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
