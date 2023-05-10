import classNames from 'classnames';
import { FC } from 'react';
import { GrClose } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../files/index.js';

type UploadQueueItemProps = {
  upload: Upload,
  className?: string;
};

type Upload = {
  id: string,
  filename: string,
  size: number,
  transferred: number,
};

const UploadQueueItem: FC<UploadQueueItemProps> = ({
  upload,
  className,
}) => {
  const { t, i18n } = useTranslation();

  const lang = i18n.language;

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
        <button className="queue-item__button" type="button">
          <GrClose className="queue-item__icon" />
        </button>
      </div>
    </li>
  );
}

export default UploadQueueItem;
