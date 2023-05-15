import { FC, ReactNode, useState, useEffect } from 'react';

import UploadQueueContext from './UploadQueueContext';
import { UploadType, UploadChangeset } from './types';
import addFile from './addFile';
import abortUploadOnServer from './abortUpload';
import submitChecksum from './submitChecksum';
import createClientChecksum from './createClientChecksum';
import registerFile from './registerFile';

type UploadQueueProviderProps = {
  children: ReactNode,
};

let nextFileId = 0;

function getNextFileId() {
  const idToReturn = nextFileId.toString();
  nextFileId += 1;
  return idToReturn;
}

const storedFiles = {
};

const UploadQueueProvider: FC<UploadQueueProviderProps> = ({
  children,
}) => {
  const [currentUpload, setCurrentUpload] = useState(null);
  const [uploadQueue, setUploadQueue] = useState([]);

  useEffect(() => {
    // If currentUpload is null, and there are still items in the
    // queue, pop item off the queue.
    if (currentUpload === null) {
      popFileFromQueue();
    }
  }, [currentUpload]);

  function addFilesToUploadQueue(files: Array<File>) {
    files.forEach((file) => {
      const id = getNextFileId();
      storedFiles[id] = file;
      setUploadQueue((prev) => [...prev, id]);
    });
  }

  function popFileFromQueue() {
    if (uploadQueue.length === 0) {
      return;
    }

    const id = uploadQueue[0];
    setCurrentUpload(id);
    setUploadQueue((prev) => prev.slice(1));
  }

  async function handleFileUpload(id: string) {
    const file = storedFiles[id];
    delete storedFiles[id];

    const registeredFile = await registerFile(file);

    const data = {
      id: registeredFile.id,
      filename: registeredFile.filename,
      size: file.size,
      transferred: 0,
      checksumProcessed: 0,
      startDate: new Date(),
    };
  }

  // Merge this with the function above.
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

  function updateUploadData(newItemProperties: UploadChangeset) {
    // Merge upload data with newItemProperties.
  }

  function removeQueueItem(fileId: string) {
    setUploadQueue((prev) => {
      const index = prev.findIndex((id) => id === fileId);

      if (index === -1) {
        return prev;
      }

      const firstPart = prev.slice(0, index);
      const lastPart = prev.slice(index + 1);
      return firstPart.concat(lastPart);
    });
  }

  function abortUpload() {
    const upload = currentUpload;

    if (!upload) {
      return;
    }

    // Find request and call abort:
    //if (upload.request) {
    //  upload.request.abort();
    //}
  }

  const contextValue = {
    currentUpload,
    uploadQueue,
    addFilesToUploadQueue,
    abortUpload,
    removeQueueItem,
  };

  return (
    <UploadQueueContext.Provider value={contextValue}>
      {children}
    </UploadQueueContext.Provider>
  );
};

export default UploadQueueProvider;
