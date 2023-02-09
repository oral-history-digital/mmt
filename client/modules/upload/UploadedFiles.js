import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { GrCheckmark } from 'react-icons/gr';

import useFiles from './useFiles';

export default function UploadedFiles({
  className,
}) {
  const { files, error } = useFiles();
  const { t, i18n } = useTranslation();

  const lang = i18n.language;

  if (error) {
    return (
      <div className="notification is-warning mt-5">
        {t('global.errors.fetch')}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="notification is-info is-light mt-5">
        {t('modules.upload.no_files')}
      </div>
    );
  }

  return (
    <div className={classNames('uploaded-files', className)}>
      <table className="table">
        <thead>
          <tr>
            <td>{t('modules.files.table.id')}</td>
            <td>{t('modules.files.table.filename')}</td>
            <td>{t('modules.files.table.size')}</td>
            <td>{t('modules.files.table.type')}</td>
            <td>{t('modules.files.table.updated_at')}</td>
            <td>{t('modules.files.table.state')}</td>
            <td>{t('modules.files.table.checksum_server')}</td>
            <td>{t('modules.files.table.checksum_client')}</td>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            let isVerified;
            const checksumsAreComplete = file.checksum_server && file.checksum_client;
            const checksumsMatch = file.checksum_client === file.checksum_server;

            if (checksumsAreComplete) {
              isVerified = checksumsMatch;
            }

            let verifiedClass;
            if (isVerified === true) {
              verifiedClass = 'has-text-success';
            } else if (isVerified === false) {
              verifiedClass = 'has-text-danger';
            } else {
              verifiedClass = 'has-text-warning';
            }

            return (
              <tr key={file._id}>
                <td>{file._id}</td>
                <td>{file.name}</td>
                <td>
                  {(Math.round(file.size / 1024 / 1024)).toLocaleString()}
                  {' '}
                  MB
                </td>
                <td>{file.type}</td>
                <td>{(new Date(file.lastModified)).toLocaleDateString(lang)}</td>
                <td>
                  <span className={classNames('tag', {
                    'is-lite': file.state === 'pending',
                    'is-warning': file.state === 'uploading',
                    'is-success': file.state === 'complete',
                  })}
                  >
                    {t(`modules.files.states.${file.state}`)}
                  </span>
                </td>
                <td>
                  {file.checksum_server && (
                    <abbr title={file.checksum_server}>
                      <GrCheckmark className={verifiedClass} />
                    </abbr>
                  )}
                </td>
                <td>
                  {file.checksum_client && (
                    <abbr title={file.checksum_client}>
                      <GrCheckmark className={verifiedClass} />
                    </abbr>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
