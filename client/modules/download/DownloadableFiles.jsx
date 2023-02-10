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
      <div className="notification is-warning">
        {t('global.errors.fetch')}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="notification is-info is-light">
        {t('modules.download.no_files')}
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
                <span title={lastModified.toString()}>
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
