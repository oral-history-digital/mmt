import { FC, ReactNode, useState } from 'react';

import UploadQueueContext from './UploadQueueContext';
import { UploadType, UploadChangeset } from './types';
import addFile from './addFile';
import abortUploadOnServer from './abortUpload';
import submitChecksum from './submitChecksum';
import createClientChecksum from './createClientChecksum';

type UploadQueueProviderProps = {
  children: ReactNode,
};

const fileStore = {
};

const UploadQueueProvider: FC<UploadQueueProviderProps> = ({
  children,
}) => {
  const [uploadQueue, setUploadQueue] = useState([]);

  function uploadFile(item: UploadType, file: File): XMLHttpRequest {
    const request = addFile({
      fileId: item.id,
      file,
      filename: item.filename,
      onProgress: (transferred) => {
        updateUploadQueueItem(item.id, { transferred });
      },
      onEnd: () => {
        removeUploadQueueItem(item.id);
        //mutate(filesEndPoint);
      },
      onAbort: async () => {
        await abortUploadOnServer(item.id);
        //mutate(filesEndPoint);
      },
    });

    createClientChecksum(file, (progress) =>
      updateUploadQueueItem(item.id, { checksumProcessed: progress })
    ).then((checksum) => {
      updateUploadQueueItem(item.id, { checksumProcessed: 1 });
      return submitChecksum(item.id, checksum);
    }).then(() => {
      // trigger reload of other data.
    });

    return request;
  }

  function addItemToUploadQueue(item: UploadType, file: File) {
    setUploadQueue((prev) => {
      fileStore[item.id] = file;
      const prevCount = prev.length;
      let itemToPutIntoQueue: UploadType;
      if (prevCount === 0) {
        const request = uploadFile(item, file);
        itemToPutIntoQueue = {
          ...item,
          request: request,
          startDate: new Date(),
        };
        delete fileStore[item.id];
      } else {
        itemToPutIntoQueue = item;
      }

      return [
        ...prev,
        itemToPutIntoQueue,
      ];
    });
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

      if (index === 0 && prev.length > 1) {
        // If the first item is removed, start the one after that.
        const nextItem = prev[1];
        const file = fileStore[nextItem.id];

        console.log(nextItem, file, fileStore);

        const request = uploadFile(nextItem, file);
        const itemToPutIntoQueue = {
          ...nextItem,
          request: request,
          startDate: new Date(),
        };
        delete fileStore[nextItem.id];

        const lastPart = prev.slice(2);
        return [itemToPutIntoQueue].concat(lastPart);
      } else {
        const firstPart = prev.slice(0, index);
        const lastPart = prev.slice(index + 1);
        return firstPart.concat(lastPart);
      }
    });
  }

  function abortUpload(fileId: string) {
    const upload = uploadQueue.find((item: UploadType) => item.id === fileId);
    if (!upload) {
      return;
    }

    if (upload.request) {
      upload.request.abort();
    } else {
      // Registered files should be deleted on the server.
    }
    removeUploadQueueItem(fileId);
  }

  const contextValue = {
    uploadQueue,
    addItemToUploadQueue,
    abortUpload,
  };

  return (
    <UploadQueueContext.Provider value={contextValue}>
      {children}
    </UploadQueueContext.Provider>
  );
};

export default UploadQueueProvider;
