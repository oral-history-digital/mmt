import { useContext, useEffect, FC } from 'react';

import UploadsContext from './UploadsContext';
import UploadQueueItem from './UploadQueueItem';
import usePrevious from './usePrevious';

type UploadQueueProps = {
  className?: string;
  onChange?: (diff: number) => void;
};

type Upload = {
  id: string,
  filename: string,
  size: number,
  transferred: number,
};

const UploadQueue: FC<UploadQueueProps> = ({
  className,
  onChange,
}) => {
  const { uploadQueue } = useContext(UploadsContext);
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
