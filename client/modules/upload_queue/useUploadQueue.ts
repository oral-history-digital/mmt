import { useContext } from 'react';

import UploadQueueContext from './UploadQueueContext';
import { UploadType, UploadChangeset } from './types';

export default function useUploadQueue() {
  const { uploadQueue, setUploadQueue } = useContext(UploadQueueContext);

  function addItemToUploadQueue(item: UploadType) {
    setUploadQueue((prev: Array<UploadType>) => [
      ...prev,
      item,
    ]);
  }

  function updateUploadQueueItem(fileId: string,
    newItemProperties: UploadChangeset) {
    setUploadQueue((prev: Array<UploadType>) => {
      const index = prev.findIndex((item: UploadType) => item.id === fileId);

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
    setUploadQueue((prev: Array<UploadType>) => {
      const index = prev.findIndex((item: UploadType) => item.id === fileId);

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
