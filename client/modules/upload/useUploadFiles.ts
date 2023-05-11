import { ChangeEvent, useState, useEffect } from 'react';
import { useSWRConfig } from 'swr';

import { FILESIZE_LIMIT } from '../files';
import { filesEndPoint } from '../api';
import { useUploadQueue, UploadType } from '../upload_queue';
import { usePrevious } from '../react_tools';
import registerFiles from './registerFiles';
import createClientChecksum from './createClientChecksum';
import submitChecksum from './submitChecksum';
import addFile from './addFile';
import abortUpload from './abortUpload';
import UploadRepository from './upload_repository';

export default function useUploadFiles() {
  const { mutate } = useSWRConfig();
  const {
    uploadQueue,
    addItemsToUploadQueue,
    updateUploadQueueItem,
    removeUploadQueueItem,
  } = useUploadQueue();
  const [errors, setErrors] = useState(null);
  const previousQueue = usePrevious(uploadQueue) as Array<UploadType>;

  useEffect(() => {
    const previousFirstId = previousQueue?.[0]?.id;
    const currentFirstId = uploadQueue[0]?.id;
    if (currentFirstId && currentFirstId !== previousFirstId) {
      startFirstItem();
    }
  }, [uploadQueue.length]);

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

    registeredFiles.forEach((file, index) => {
      UploadRepository.addFile(file.id, withinLimitFiles[index]);
    });

    addItemsToUploadQueue(registeredFiles.map((file) => ({
      id: file.id,
      filename: file.filename,
      size: file.size,
      transferred: 0,
      checksumProcessed: 0,
      startDate: null,
    })));
  }

  async function startFirstItem() {
    const file = uploadQueue[0];

    const xmlHttpRequest = addFile({
      fileId: file.id,
      file: UploadRepository.getFile(file.id),
      filename: file.filename,
      onProgress: (transferred) => {
        updateUploadQueueItem(file.id, { transferred });
      },
      onEnd: () => {
        removeUploadQueueItem(file.id);
        UploadRepository.removeRequest(file.id);
        mutate(filesEndPoint);
      },
      onAbort: async () => {
        await abortUpload(file.id);
        mutate(filesEndPoint);
      },
    });

    UploadRepository.addRequest(file.id, xmlHttpRequest);

    const checksum = await createClientChecksum(
      UploadRepository.getFile(file.id),
      (progress) => updateUploadQueueItem(file.id, { checksumProcessed: progress })
    );
    UploadRepository.removeFile(file.id);

    updateUploadQueueItem(file.id, { checksumProcessed: 1 });
    await submitChecksum(file.id, checksum);

    mutate(filesEndPoint);
  }

  return {
    handleFileChange,
    errors,
  };
}
