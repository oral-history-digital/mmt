import classNames from 'classnames';
import { FC } from 'react';
import { GrClose } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

import useUploadQueue from './useUploadQueue';

type UploadQueueItemProps = {
  upload: string,
  index: number,
  className?: string;
};

const UploadQueueItem: FC<UploadQueueItemProps> = ({
  upload,
  index,
  className,
}) => {
  const { removeQueueItem } = useUploadQueue();
  const { t } = useTranslation();

  function handleCancelClick() {
    removeQueueItem(upload);
  }

  return (
    <li className={classNames('queue-item', className)}>
      <div className="queue-item__body">
        <h3 className="queue-item__name">{index}. {upload}</h3>
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
