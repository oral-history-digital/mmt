import { FC, ReactNode, useState, useEffect, useRef } from 'react';
import { useSWRConfig } from 'swr';

import { filesEndPoint } from '../api';
import UploadQueueContext from './UploadQueueContext';
import { UploadData, UploadQueueItemType } from './types';
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
  const { mutate } = useSWRConfig();
  const [currentUpload, setCurrentUpload] = useState<UploadData | null>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const xhrRef = useRef(null);

  useEffect(() => {
    // If currentUpload is null, and there are still items in the
    // queue, pop item off the queue.
    if (currentUpload === null) {
      popFileFromQueue();
    } else {
      handleFileUpload();
    }
    // On component unmount, the request should maybe be aborted.
  }, [currentUpload?.id]);

  useEffect(() => {
    if (currentUpload === null) {
      popFileFromQueue();
    }
  }, [JSON.stringify(uploadQueue)]);

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
    const file = storedFiles[id];
    setCurrentUpload({
      id,
      filename: file.name,
      size: file.size,
      transferred: 0,
      checksumProcessed: 0,
      startDate: null,
    });
    setUploadQueue((prev) => prev.slice(1));
  }

  async function handleFileUpload() {
    const file = storedFiles[currentUpload.id];
    delete storedFiles[currentUpload.id];

    // TODO: During registering, the cancel upload button can still
    // be clicked. This should be handled appropriately.
    const registeredFile = await registerFile(file);

    setCurrentUpload((prev) => ({
      ...prev,
      _id: registeredFile._id, // Do we need this?
      filename: registeredFile.name,
      startDate: new Date(),
    }));

    const request = addFile({
      fileId: registeredFile._id,
      file,
      filename: registeredFile.name,
      onProgress: (transferred) => setCurrentUpload((prev) => ({
        ...prev,
        transferred,
      })),
      onEnd: () => {
        setCurrentUpload(null);
        xhrRef.current = null;
        mutate(filesEndPoint);
      },
      onAbort: async () => {
        await abortUploadOnServer(registeredFile._id);
        mutate(filesEndPoint);
      },
    });
    xhrRef.current = request;

    createClientChecksum(file, (progress) => setCurrentUpload((prev) => ({
        ...prev,
        checksumProcessed: progress,
      })),
    ).then((checksum) => {
      setCurrentUpload((prev) => ({
        ...prev,
        checksumProcessed: 1,
      }));
      return submitChecksum(registeredFile._id, checksum);
    }).then(() => {
      // trigger reload of other data.
    });
  }

  function removeQueueItem(fileId: string) {
    setUploadQueue((prev) => {
      const index = prev.findIndex((id) => id === fileId);

      if (index === -1) {
        return prev;
      }

      delete storedFiles[fileId];
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

    const xhr = xhrRef.current;
    if (xhr && xhr.readyState !== 4) {
      xhr.abort();
    }
  }

  const uploadQueueItems: Array<UploadQueueItemType> = uploadQueue.map((id) => {
    const file: File = storedFiles[id];

    return {
      id,
      filename: file.name,
      size: file.size,
    };
  });

  let combinedUploadCount = uploadQueue.length;
  if (currentUpload) {
    combinedUploadCount += 1;
  }

  const contextValue = {
    currentUpload,
    uploadQueueItems,
    combinedUploadCount,
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
