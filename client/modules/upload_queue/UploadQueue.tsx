import { FC } from 'react';

import UploadQueueItem from './UploadQueueItem';
import CurrentUpload from './CurrentUpload';
import useUploadQueue from './useUploadQueue';

type UploadQueueProps = {
  className?: string;
};

const UploadQueue: FC<UploadQueueProps> = ({
  className,
}) => {
  const { currentUpload, uploadQueue } = useUploadQueue();

  return (
    <ul className={className}>
      <>
        {currentUpload && <CurrentUpload upload={currentUpload} />}
        {uploadQueue.map((upload: string, index: number) => (
          <UploadQueueItem
            key={upload}
            index={index + 1}
            upload={upload}
          />
        ))}
      </>
    </ul>
  );
}

export default UploadQueue;
