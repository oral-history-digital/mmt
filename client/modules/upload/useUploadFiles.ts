import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSWRConfig } from 'swr';

import { FILESIZE_LIMIT } from '../files/index.js';
import { filesEndPoint } from '../api/index.js';
import {
  addActivity,
  updateActivity,
  ACTIVITY_TYPE_CHECKSUM,
  ACTIVITY_TYPE_UPLOAD,
} from '../activities/index.js';
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

  const dispatch = useDispatch();

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
      if (file.size <= FILESIZE_LIMIT) {
        const fileId = registeredFiles[i].id;
        const updatedFilename = registeredFiles[i].filename;

        dispatch(addActivity(`upload${fileId}`, updatedFilename,
          ACTIVITY_TYPE_UPLOAD, file.size));

        const xmlHttpRequest = addFile({
          fileId,
          file,
          filename: updatedFilename,
          onProgress: (transferred) => {
            dispatch(updateActivity(`upload${fileId}`, transferred));
            updateUploadQueueItem(fileId, { transferred });
          },
          onEnd: () => {
            dispatch(updateActivity(`upload${fileId}`, file.size));
            removeUploadQueueItem(fileId);
            mutate(filesEndPoint);
          },
          onAbort: () => {
            abortUpload(fileId);
          },
        });

        addItemToUploadQueue({
          id: fileId,
          filename: updatedFilename,
          size: file.size,
          transferred: 0,
          startDate: new Date(),
          request: xmlHttpRequest,
        });
      }
    }

    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i);
      if (file.size <= FILESIZE_LIMIT) {
        const { id, filename } = registeredFiles[i];

        dispatch(addActivity(`checksum${id}`, filename, ACTIVITY_TYPE_CHECKSUM, 1));
        const checksum = await createClientChecksum(file, (progress: number): void => {
          dispatch(updateActivity(`checksum${id}`, progress));
        });

        dispatch(updateActivity(`checksum${id}`, 1));

        const updatedFileData = await submitChecksum(registeredFiles[i].id, checksum);
      }
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
