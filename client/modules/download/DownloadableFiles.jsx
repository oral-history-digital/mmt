import React from 'react';
import { useTranslation } from 'react-i18next';

import { downloadEndPoint } from '../api';
import { formatBytes } from '../files';
import { Message } from '../ui';
import useDownloadableFiles from './useDownloadableFiles';

export default function DownloadableFiles() {
  const { files, error } = useDownloadableFiles();

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (error) {
    return (
      <Message type="warning">
        {t('global.errors.fetch')}
      </Message>
    );
  }

  if (files.length === 0) {
    return (
      <Message type="info">
        {t('modules.download.no_files')}
      </Message>
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
