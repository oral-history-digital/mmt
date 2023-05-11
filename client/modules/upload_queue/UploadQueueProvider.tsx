import { FC, ReactNode, useState } from 'react';

import UploadQueueContext from './UploadQueueContext';
import { UploadType, UploadChangeset } from './types';

type UploadQueueProviderProps = {
  children: ReactNode,
};

const UploadQueueProvider: FC<UploadQueueProviderProps> = ({
  children,
}) => {
  const [uploadQueue, setUploadQueue] = useState([]);

  function addItemToUploadQueue(item: UploadType) {
    const next = [
      ...uploadQueue,
      item,
    ];
    setUploadQueue(next);
    return next;
  }

  function addItemsToUploadQueue(items: Array<UploadType>) {
    setUploadQueue((prev: Array<UploadType>) => [
      ...prev,
      ...items,
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

  const contextValue = {
    uploadQueue,
    addItemToUploadQueue,
    addItemsToUploadQueue,
    updateUploadQueueItem,
    removeUploadQueueItem,
  };

  return (
    <UploadQueueContext.Provider value={contextValue}>
      {children}
    </UploadQueueContext.Provider>
  );
};

export default UploadQueueProvider;
