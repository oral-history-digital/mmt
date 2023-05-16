import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { GrCheckmark, GrAlert } from 'react-icons/gr';

import { formatBytes } from '../files';
import { Message } from '../ui';
import { RegisteredFile } from '../upload_queue';
import useFiles from './useFiles';
import useHandleDeleteFile from './useHandleDeleteFile';
import {
  FILE_STATE_PENDING,
  FILE_STATE_UPLOADING,
  FILE_STATE_COMPLETE,
  FILE_STATE_ABORTED,
  FILE_STATE_MISSING,
} from './constants';

export default function UploadedFiles({
  className,
}) {
  const { files, error, isLoading, isValidating } = useFiles();
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
    <div className={classNames('uploaded-files', className, {
      'uploaded-files--is-loading': isLoading || isValidating})}>
      <table className="table">
        <thead>
          <tr>
            <td><b>{t('modules.files.table.filename')}</b></td>
            <td><b>{t('modules.files.table.size')}</b></td>
            <td><b>{t('modules.files.table.transferred')}</b></td>
            <td><b>{t('modules.files.table.type')}</b></td>
            <td><b>{t('modules.files.table.last_modified')}</b></td>
            <td><b>{t('modules.files.table.uploaded_at')}</b></td>
            <td><b>{t('modules.files.table.state')}</b></td>
            <td><b>{t('modules.files.table.checksum')}</b></td>
            <td><b>{t('modules.files.table.actions')}</b></td>
          </tr>
        </thead>
        <tbody>
          {files.map((file: RegisteredFile) => {
            const lastModified = new Date(file.lastModified);
            const createdAt = new Date(file.createdAt);

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
                  <span title={`${createdAt.toLocaleDateString(lang)} ${createdAt.toLocaleTimeString(lang)}`}>
                    {createdAt.toLocaleDateString(lang)}
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
                  {typeof file.verified !== 'undefined' && (
                    <abbr>
                      {file.verified ?
                        <GrCheckmark className="has-text-success" /> :
                        <GrAlert className="has-text-danger" />
                      }
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
