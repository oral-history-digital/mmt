import { useContext } from 'react';

import UploadQueueContext from './UploadQueueContext';

export default function useUploadQueue() {
  const { uploadQueue, setUploadQueue } = useContext(UploadQueueContext);

  return {
    uploadQueue,
    setUploadQueue,
  };
}
