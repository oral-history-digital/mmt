import { useContext } from 'react';

import UploadQueueContext from './UploadQueueContext';
import { Upload, UploadChangeset } from './types';

export default function useUploadQueue() {
  const { uploadQueue, setUploadQueue } = useContext(UploadQueueContext);

  function addItemToUploadQueue(item: Upload) {
    setUploadQueue((prev: Array<Upload>) => [
      ...prev,
      item,
    ]);
  }

  function updateUploadQueueItem(fileId: string,
    newItemProperties: UploadChangeset) {
    setUploadQueue((prev: Array<Upload>) => {
      const index = prev.findIndex((item: Upload) => item.id === fileId);

      if (index === -1) {
        return prev;
      }

      const firstPart = prev.slice(0, index);
      const newItem = {
        ...prev[index],
        ...newItemProperties,
      };
      const lastPart = prev.slice(index + 1);

      return firstPart.concat(newItem).concat(lastPart);
    });
  }

  function removeUploadQueueItem(fileId: string) {
    setUploadQueue((prev: Array<Upload>) => {
      const index = prev.findIndex((item: Upload) => item.id === fileId);

      if (index === -1) {
        return prev;
      }

      const firstPart = prev.slice(0, index);
      const lastPart = prev.slice(index + 1);

      return firstPart.concat(lastPart);
    });
  }

  return {
    uploadQueue,
    addItemToUploadQueue,
    updateUploadQueueItem,
    removeUploadQueueItem,
  };
}
