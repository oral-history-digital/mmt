import classNames from 'classnames';
import { FC } from 'react';
import { GrClose } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../files';
import useUploadQueue from './useUploadQueue';
import { UploadQueueItemType } from './types';

type UploadQueueItemProps = {
  upload: UploadQueueItemType,
  className?: string;
};

const UploadQueueItem: FC<UploadQueueItemProps> = ({
  upload,
  className,
}) => {
  const { removeQueueItem } = useUploadQueue();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  function handleCancelClick() {
    removeQueueItem(upload.id);
  }

  return (
    <li className={classNames('queue-item', className)}>
      <div className="queue-item__body">
        <h3 className="queue-item__name">{upload.filename}</h3>
        <p className="queue-item__details">
          {formatBytes(upload.size, lang)}
        </p>
      </div>
      <div className="queue-item__actions">
        <button
          type="button"
          className="queue-item__button"
          aria-label={t('modules.upload_queue.cancel_upload')}
          title={t('modules.upload_queue.cancel_upload')}
          onClick={handleCancelClick}
        >
          <GrClose className="queue-item__icon" />
        </button>
      </div>
    </li>
  );
}

export default UploadQueueItem;
