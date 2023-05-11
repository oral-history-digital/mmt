import { useContext } from 'react';

import UploadQueueContext from './UploadQueueContext';

export default function useUploadQueue() {
  const {
    uploadQueue,
    addItemToUploadQueue,
    addItemsToUploadQueue,
    updateUploadQueueItem,
    removeUploadQueueItem,
  } = useContext(UploadQueueContext);

  return {
    uploadQueue,
    addItemToUploadQueue,
    addItemsToUploadQueue,
    updateUploadQueueItem,
    removeUploadQueueItem,
  };
}
