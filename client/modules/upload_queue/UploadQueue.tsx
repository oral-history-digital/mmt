import { useEffect, FC } from 'react';

import UploadQueueItem from './UploadQueueItem';
import usePrevious from './usePrevious';
import { Upload } from './types';
import useUploadQueue from './useUploadQueue';

type UploadQueueProps = {
  className?: string;
  onChange?: (diff: number) => void;
};

const UploadQueue: FC<UploadQueueProps> = ({
  className,
  onChange,
}) => {
  const { uploadQueue } = useUploadQueue();
  const previousQueue = usePrevious(uploadQueue) as Array<Upload>;

  useEffect(() => {
    const previousLength = previousQueue ? previousQueue.length : 0;
    const currentLength = uploadQueue.length;

    if (typeof onChange === 'function') {
      onChange(currentLength - previousLength);
    }
  }, [uploadQueue.length]);

  return (
    <ul className={className}>
      {uploadQueue.map((upload: Upload) => (
        <UploadQueueItem key={upload.id} upload={upload} />
      ))}
    </ul>
  );
}

export default UploadQueue;
