import { useTranslation } from 'react-i18next';
import { GrUpload } from 'react-icons/gr';

import { Message } from '../ui/index';
import { formatBytes, FILESIZE_LIMIT } from '../files';
import useUploadFiles from './useUploadFiles';

export default function UploadButton() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { handleFileChange, errors } = useUploadFiles();

  return (
    <>
      {errors && (
        <Message type="error">
          <p>
            {t('modules.upload.fileSizeError', {
              count: errors.length,
              limit: formatBytes(FILESIZE_LIMIT, lang),
            })}
          </p>
          <ul>
            {errors.map((filename: string) =>
              (<li key={filename}>{filename}</li>))
            }
          </ul>
        </Message>
      )}
      <form className="file is-boxed">
        <label htmlFor="file-input" className="file-label">
          <input
            className="file-input"
            type="file"
            name="files"
            id="file-input"
            accept="video/*,audio/*,image/*"
            multiple
            onChange={handleFileChange}
          />
          <span className="file-cta">
            <span className="file-icon">
              <GrUpload />
            </span>
            <span className="file-label">
              {t('modules.upload.select_files')}
            </span>
          </span>
        </label>
      </form>
    </>
  );
}
