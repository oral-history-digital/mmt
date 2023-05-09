import classNames from 'classnames';
import { FC } from 'react';
import { GrClose } from 'react-icons/gr';

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
  return (
    <li className={classNames('queue-item', className)}>
      <div className="queue-item__body">
        <h3 className="queue-item__name">{upload.filename}</h3>
        <p className="queue-item__details">{upload.transferred} / {upload.size}</p>
      </div>
      <div className="queue-item__actions">
        <button type="button">
          <GrClose className="queue-item__icon" />
        </button>
      </div>
    </li>
  );
}

export default UploadQueueItem;
