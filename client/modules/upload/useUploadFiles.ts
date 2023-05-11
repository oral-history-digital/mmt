import { ChangeEvent, useState } from 'react';
import { useSWRConfig } from 'swr';

import { FILESIZE_LIMIT } from '../files';
import { filesEndPoint } from '../api';
import { RegisteredFile } from './types';
import { useUploadQueue } from '../upload_queue';
import registerFiles from './registerFiles';
import createClientChecksum from './createClientChecksum';
import submitChecksum from './submitChecksum';
import addFile from './addFile';
import abortUpload from './abortUpload';

export default function useUploadFiles() {
  const { mutate } = useSWRConfig();
  const {
    addItemToUploadQueue,
    addItemsToUploadQueue,
    updateUploadQueueItem,
    removeUploadQueueItem,
  } = useUploadQueue();
  const [errors, setErrors] = useState(null);

  async function handleFileChange(event: ChangeEvent) {
    // Get and convert files from input element.
    const target = event.target as HTMLInputElement;
    const fileList = target.files as FileList;
    const files = Array.from(fileList);

    // Error handling.
    const aboveLimitFiles = files.filter((file) => file.size > FILESIZE_LIMIT);
    const withinLimitFiles = files.filter((file) => file.size <= FILESIZE_LIMIT);
    if (aboveLimitFiles.length > 0) {
      setErrors(aboveLimitFiles);
    }
    if (withinLimitFiles.length === 0) {
      return;
    }

    const registeredFiles = await registerFiles(withinLimitFiles);
    addFilesToQueue(registeredFiles);

    // Wanted: Add all items to the queue (at once).
    // Do not start anything here. There could be running processes.

    // Mixed: Start upload and add to queue.
    withinLimitFiles.forEach((file, index) => {
      const fileId = registeredFiles[index].id;
      const updatedFilename = registeredFiles[index].filename;

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
    });

    // Mixed?: Start checksum creation and update queue item.
    withinLimitFiles.forEach(async (file, index) => {
      const { id } = registeredFiles[index];

      const checksum = await createClientChecksum(file, (progress) => {
        updateUploadQueueItem(id, { checksumProcessed: progress });
      });

      updateUploadQueueItem(id, { checksumProcessed: 1 });
      await submitChecksum(id, checksum);
    });

    mutate(filesEndPoint);
  }

  function addFilesToQueue(files: Array<RegisteredFile>) {
    addItemsToUploadQueue(files.map((file) => ({
      id: file.id,
      filename: file.filename,
      size: file.size,
      transferred: 0,
      checksumProcessed: 0,
      startDate: null,
      request: null,
    })));
  }

  return {
    handleFileChange,
    errors,
  };
}
