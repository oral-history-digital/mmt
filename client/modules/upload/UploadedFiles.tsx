import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { GrCheckmark } from 'react-icons/gr';

import { formatBytes } from '../files';
import { Message } from '../ui/index';
import useFiles from './useFiles';
import useHandleDeleteFile from './useHandleDeleteFile';
import {
  FILE_STATE_PENDING,
  FILE_STATE_UPLOADING,
  FILE_STATE_COMPLETE,
  FILE_STATE_ABORTED,
  FILE_STATE_MISSING,
} from './constants';
import { UploadedFile } from './types';

export default function UploadedFiles({
  className,
}) {
  const { files, error } = useFiles();
  const { t, i18n } = useTranslation();
  const handleDelete = useHandleDeleteFile();

  const lang = i18n.language;

  if (error) {
    return (
      <Message type="warning" className="mt-5">
        {t('global.errors.fetch')}
      </Message>
    );
  }

  if (files === null || files.length === 0) {
    return (
      <Message type="info" className="mt-5">
        {t('modules.upload.no_files')}
      </Message>
    );
  }

  return (
    <div className={classNames('uploaded-files', className)}>
      <table className="table">
        <thead>
          <tr>
            <td><b>{t('modules.files.table.filename')}</b></td>
            <td><b>{t('modules.files.table.size')}</b></td>
            <td><b>{t('modules.files.table.transferred')}</b></td>
            <td><b>{t('modules.files.table.type')}</b></td>
            <td><b>{t('modules.files.table.updated_at')}</b></td>
            <td><b>{t('modules.files.table.state')}</b></td>
            <td><b>{t('modules.files.table.checksum_server')}</b></td>
            <td><b>{t('modules.files.table.checksum_client')}</b></td>
            <td><b>{t('modules.files.table.actions')}</b></td>
          </tr>
        </thead>
        <tbody>
          {files.map((file: UploadedFile) => {
            let isVerified: boolean;
            const checksumsAreComplete = file.checksum_server && file.checksum_client;
            const checksumsMatch = file.checksum_client === file.checksum_server;

            if (checksumsAreComplete) {
              isVerified = checksumsMatch;
            }

            let verifiedClass: string;
            if (isVerified === true) {
              verifiedClass = 'has-text-success';
            } else if (isVerified === false) {
              verifiedClass = 'has-text-danger';
            } else {
              verifiedClass = 'has-text-warning';
            }

            const lastModified = new Date(file.lastModified);

            return (
              <tr id={file._id} key={file._id}>
                <td>{file.name}</td>
                <td>
                  <span title={`${file.size.toLocaleString(lang)} Bytes`}>
                    {formatBytes(file.size, lang)}
                  </span>
                </td>
                <td>
                  <span title={`${file.transferred.toLocaleString(lang)} Bytes`}>
                    {formatBytes(file.transferred, lang)}
                  </span>
                </td>
                <td>{file.type}</td>
                <td>
                  <span title={`${lastModified.toLocaleDateString(lang)} ${lastModified.toLocaleTimeString(lang)}`}>
                    {lastModified.toLocaleDateString(lang)}
                  </span>
                </td>
                <td>
                  <span
                    className={classNames('tag', {
                      'is-lite': file.state === FILE_STATE_PENDING,
                      'is-info': file.state === FILE_STATE_UPLOADING,
                      'is-success': file.state === FILE_STATE_COMPLETE,
                      'is-danger': file.state === FILE_STATE_ABORTED,
                      'is-warning': file.state === FILE_STATE_MISSING,
                    })}
                    title={t(`modules.files.states.${file.state}_explanation`)}
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
                <td>
                  <button
                    type="button"
                    className={classNames('button', 'is-small',
                      file.state === FILE_STATE_MISSING ?
                        'is-warning' :
                        'is-danger'
                    )}
                    onClick={() => handleDelete(file)}
                    disabled={file.state !== FILE_STATE_COMPLETE
                      && file.state !== FILE_STATE_MISSING
                      && file.state !== FILE_STATE_ABORTED}
                  >
                    {file.state === FILE_STATE_MISSING ? t('modules.files.actions.remove')
                      : t('modules.files.actions.delete')}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
