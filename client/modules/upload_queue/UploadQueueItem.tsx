import classNames from 'classnames';
import { FC } from 'react';
import { GrClose } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../files/index.js';
import { Upload } from './types';

type UploadQueueItemProps = {
  upload: Upload,
  className?: string;
};

const UploadQueueItem: FC<UploadQueueItemProps> = ({
  upload,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  function handleCancelClick() {
    upload.request.abort();
  }

  return (
    <li className={classNames('queue-item', className)}>
      <div className="queue-item__body">
        <h3 className="queue-item__name">{upload.filename}</h3>
        <p className="queue-item__details">
          {formatBytes(upload.transferred, lang)}
          {' / '}
          {formatBytes(upload.size, lang)}
        </p>
      </div>
      <div className="queue-item__actions">
        <button
          type="button"
          className="queue-item__button"
          aria-label="Cancel upload"
          title="Cancel upload"
          onClick={handleCancelClick}
        >
          <GrClose className="queue-item__icon" />
        </button>
      </div>
    </li>
  );
}

export default UploadQueueItem;
