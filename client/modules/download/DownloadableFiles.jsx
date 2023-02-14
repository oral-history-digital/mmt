import React from 'react';
import { useTranslation } from 'react-i18next';

import { downloadEndPoint } from '../api';
import useDownloadableFiles from './useDownloadableFiles';
import { formatBytes } from '../files';

export default function DownloadableFiles() {
  const { files, error } = useDownloadableFiles();

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (error) {
    return (
      <article className="message is-warning">
        <div className="message-body">
          {t('global.errors.fetch')}
        </div>
      </article>
    );
  }

  if (files.length === 0) {
    return (
      <article className="message is-info is-light">
        <div className="message-body">
          {t('modules.download.no_files')}
        </div>
      </article>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <td><b>{t('modules.files.table.filename')}</b></td>
          <td><b>{t('modules.files.table.size')}</b></td>
          <td><b>{t('modules.files.table.type')}</b></td>
          <td><b>{t('modules.files.table.updated_at')}</b></td>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => {
          const lastModified = new Date(file.lastModified);

          return (
            <tr key={file.name}>
              <td>
                <a
                  href={`${downloadEndPoint}?filename=${file.encoded}`}
                  download
                >
                  {file.name}
                </a>
              </td>
              <td>
                <span title={`${file.size.toLocaleString(lang)} Bytes`}>
                  {formatBytes(file.size, lang)}
                </span>
              </td>
              <td>{file.type}</td>
              <td>
                <span title={`${lastModified.toLocaleDateString(lang)} ${lastModified.toLocaleTimeString(lang)}`}>
                  {lastModified.toLocaleDateString(lang)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
