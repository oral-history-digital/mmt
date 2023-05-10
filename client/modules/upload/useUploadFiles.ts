import { ChangeEvent, useState } from 'react';
import { useSWRConfig } from 'swr';

import { FILESIZE_LIMIT } from '../files';
import { filesEndPoint } from '../api';
import { useUploadQueue } from '../upload_queue';
import registerFiles from './registerFiles';
import createClientChecksum from './createClientChecksum';
import submitChecksum from './submitChecksum';
import addFile from './addFile';
import storedRequests from './requests';
import abortUpload from './abortUpload';

export default function useUploadFiles() {
  const { mutate } = useSWRConfig();
  const {
    addItemToUploadQueue,
    updateUploadQueueItem,
    removeUploadQueueItem,
  } = useUploadQueue();
  const [errors, setErrors] = useState(null);

  async function handleFileChange(event: ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const fileData = [];

    const aboveLimitFiles = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i);

      if (file.size > FILESIZE_LIMIT) {
        aboveLimitFiles.push(file.name);
      } else {
        fileData.push({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        });
      }
    }

    if (aboveLimitFiles.length > 0) {
      setErrors(aboveLimitFiles);
    }

    if (fileData.length === 0) {
      return;
    }

    const registeredFiles = await registerFiles(fileData);

    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i);
      if (file.size > FILESIZE_LIMIT) {
        continue;
      }

      const fileId = registeredFiles[i].id;
      const updatedFilename = registeredFiles[i].filename;

      const xmlHttpRequest = addFile({
        fileId,
        file,
        filename: updatedFilename,
        onProgress: (transferred) => {
          updateUploadQueueItem(fileId, { transferred });
        },
        onEnd: () => {
          removeUploadQueueItem(fileId);
          mutate(filesEndPoint);
        },
        onAbort: async () => {
          await abortUpload(fileId);
          mutate(filesEndPoint);
        },
      });

      addItemToUploadQueue({
        id: fileId,
        filename: updatedFilename,
        size: file.size,
        transferred: 0,
        checksumProcessed: 0,
        startDate: new Date(),
        request: xmlHttpRequest,
      });
    }

    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i);
      if (file.size > FILESIZE_LIMIT) {
        continue;
      }

      const { id, filename } = registeredFiles[i];

      updateUploadQueueItem(id, { checksumProcessed: 0 });

      const checksum = await createClientChecksum(file, (progress) => {
        updateUploadQueueItem(id, { checksumProcessed: progress });
      });

      const updatedFileData = await submitChecksum(registeredFiles[i].id, checksum);
      updateUploadQueueItem(id, { checksumProcessed: 1 });
    }

    mutate(filesEndPoint);
  }


  function handleAbort(id: string) {
    storedRequests[id]?.abort();
  }

  return {
    handleFileChange,
    errors,
  };
}
