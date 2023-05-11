import { useEffect, FC } from 'react';

import UploadQueueItem from './UploadQueueItem';
import usePrevious from './usePrevious';
import { UploadType } from './types';
import useUploadQueue from './useUploadQueue';

type UploadQueueProps = {
  className?: string;
  onAdd?: (count: number) => void;
  onRemove?: (count: number) => void;
};

const UploadQueue: FC<UploadQueueProps> = ({
  className,
  onAdd,
  onRemove,
}) => {
  const { uploadQueue } = useUploadQueue();
  const previousQueue = usePrevious(uploadQueue) as Array<UploadType>;

  useEffect(() => {
    const previousLength = previousQueue ? previousQueue.length : 0;
    const currentLength = uploadQueue.length;

    if (currentLength > previousLength && typeof onAdd === 'function') {
      onAdd(currentLength);
    } else if (currentLength < previousLength && typeof onRemove === 'function') {
      onRemove(currentLength);
    }
  }, [uploadQueue.length]);

  return (
    <ul className={className}>
      {uploadQueue.map((upload: UploadType) => (
        <UploadQueueItem
          key={upload.id}
          upload={upload}
          active={upload.transferred > 0}
        />
      ))}
    </ul>
  );
}

export default UploadQueue;
