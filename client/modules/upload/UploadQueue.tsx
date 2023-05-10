import { useContext, FC } from 'react';

import UploadsContext from './UploadsContext';
import UploadQueueItem from './UploadQueueItem';

type UploadQueueProps = {
  className?: string;
};

type Upload = {
  id: string,
  filename: string,
  size: number,
  transferred: number,
};

const UploadQueue: FC<UploadQueueProps> = ({
  className,
}) => {
  const { uploadQueue } = useContext(UploadsContext);

  return (
    <ul className={className}>
      {uploadQueue.map((upload: Upload) => (
        <UploadQueueItem key={upload.id} upload={upload} />
      ))}
    </ul>
  );
}

export default UploadQueue;
