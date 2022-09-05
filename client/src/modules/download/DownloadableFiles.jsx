import { useTranslation } from 'react-i18next';

import { downloadEndPoint } from '../api';
import useDownloadableFiles from '../../hooks/useDownloadableFiles';

export default function DownloadableFiles() {
    const { files, error } = useDownloadableFiles();

    const { t } = useTranslation();

    if (error) {
        return (
            <div class="notification is-warning">
                {t('global.errors.fetch')}
            </div>
        );
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <td>{t('modules.files.table.filename')}</td>
                    <td>{t('modules.files.table.size')}</td>
                    <td>{t('modules.files.table.type')}</td>
                    <td>{t('modules.files.table.updated_at')}</td>
                </tr>
            </thead>
            <tbody>
                {files.map(file => (
                    <tr key={file.name}>
                        <td>
                            <a
                                href={`${downloadEndPoint}?filename=${file.encoded}`}
                                download
                            >
                                {file.name}
                            </a>
                        </td>
                        <td>{(Math.round(file.size / 1024 / 1024)).toLocaleString()} MB</td>
                        <td>{file.type}</td>
                        <td>{(new Date(file.lastModified)).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
