import classNames from 'classnames';
import { FC } from 'react';
import { GrClose } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import { formatDistance, addMilliseconds } from 'date-fns';
import { de } from 'date-fns/locale';

import { formatBytes } from '../files';
import { UploadData } from './types';
import ProgressBar from './ProgressBar';
import remainingTime from './remainingTime';
import useUploadQueue from './useUploadQueue';

type CurrentUploadProps = {
  upload: UploadData,
  className?: string;
};

const CurrentUpload: FC<CurrentUploadProps> = ({
  upload,
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
    <li className={classNames('queue-item', 'queue-item--is-active',
    className)}>
      <div className="queue-item__body">
        <h3 className="queue-item__name">{upload.filename}</h3>
        <p className="queue-item__details">
          {formatBytes(upload.size, lang)}
          {showRemainingTime ? ` – ${timeToGo}` : ''}
        </p>
        <ProgressBar
          percentage={percentage}
          color="#007bff"
          label={t('modules.upload_queue.upload')}
        />
        <ProgressBar
          percentage={percentageChecksum}
          color="yellowgreen"
          label={t('modules.upload_queue.checksum')}
        />
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

export default CurrentUpload;
