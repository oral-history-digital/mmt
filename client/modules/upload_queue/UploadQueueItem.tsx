import classNames from 'classnames';
import { FC } from 'react';
import { GrClose } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import { formatDistance, addMilliseconds } from 'date-fns';
import { de } from 'date-fns/locale';

import { formatBytes } from '../files';
import { UploadType } from './types';
import ProgressBar from './ProgressBar';
import remainingTime from './remainingTime';
import useUploadQueue from './useUploadQueue';

type UploadQueueItemProps = {
  upload: UploadType,
  active: boolean,
  className?: string;
};

const UploadQueueItem: FC<UploadQueueItemProps> = ({
  upload,
  active,
  className,
}) => {
  const { abortUpload } = useUploadQueue();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const showRemainingTime = upload.transferred > 0;

  const localeOptions: any = {};
  if (lang === 'de') {
    localeOptions.locale = de;
  }

  let remainingMilliseconds: number;
  let now = new Date();
  let futureDate = new Date();
  if (upload.transferred) {
    remainingMilliseconds = remainingTime(upload.startDate, upload.size, upload.transferred);
    futureDate = addMilliseconds(now, remainingMilliseconds);
  }

  const timeToGo = formatDistance(futureDate, now, {
    ...localeOptions,
  });

  const percentage = upload.transferred / upload.size * 100;
  const percentageChecksum = upload.checksumProcessed / 1 * 100;

  function handleCancelClick() {
    abortUpload(upload.id);
  }

  return (
    <li className={classNames('queue-item', className, {
      'queue-item--is-active': active,
    })}>
      <div className="queue-item__body">
        <h3 className="queue-item__name">{upload.filename}</h3>
        <p className="queue-item__details">
          {formatBytes(upload.size, lang)}
          {showRemainingTime ? ` – ${timeToGo}` : ''}
        </p>
        <ProgressBar percentage={percentage} />
        <ProgressBar alt percentage={percentageChecksum} />
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
