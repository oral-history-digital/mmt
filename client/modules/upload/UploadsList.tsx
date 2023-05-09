import { useContext, FC } from 'react';

import UploadsContext from './UploadsContext';
import UploadQueueItem from './UploadQueueItem';

type UploadsListProps = {
  className?: string;
};

type Upload = {
  id: string,
  filename: string,
  size: number,
  transferred: number,
};

const UploadsList: FC<UploadsListProps> = ({
  className,
}) => {
  const uploads = useContext(UploadsContext);

  return (
    <ul className={className}>
      {uploads.map((upload: Upload) => (
        <UploadQueueItem key={upload.id} upload={upload} />
      ))}
    </ul>
  );
}

export default UploadsList;
