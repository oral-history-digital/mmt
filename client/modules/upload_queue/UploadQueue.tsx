import { FC } from 'react';

import UploadQueueItem from './UploadQueueItem';
import CurrentUpload from './CurrentUpload';
import useUploadQueue from './useUploadQueue';
import { UploadQueueItemType } from './types';

type UploadQueueProps = {
  className?: string;
};

const UploadQueue: FC<UploadQueueProps> = ({
  className,
}) => {
  const { currentUpload, uploadQueueItems } = useUploadQueue();

  return (
    <ul className={className}>
      <>
        {currentUpload && <CurrentUpload upload={currentUpload} />}
        {uploadQueueItems.map((item: UploadQueueItemType) => (
          <UploadQueueItem
            key={item.id}
            upload={item}
          />
        ))}
      </>
    </ul>
  );
}

export default UploadQueue;
