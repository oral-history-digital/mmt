import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSWRConfig } from 'swr';

import { FILESIZE_LIMIT } from '../files/index.js';
import { filesEndPoint, uploadEndPoint } from '../api/index.js';
import {
  addActivity,
  updateActivity,
  ACTIVITY_TYPE_UPLOAD,
  ACTIVITY_TYPE_CHECKSUM,
} from '../activities/index.js';
import registerFiles from './registerFiles';
import createClientChecksum from './createClientChecksum';
import submitChecksum from './submitChecksum';

const requests = {};

export default function useUploadFiles() {
  const { mutate } = useSWRConfig();
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
        addFile(file, registeredFiles[i].id, registeredFiles[i].filename);
      }
    }

    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i);
      if (file.size <= FILESIZE_LIMIT) {
        const { id, filename } = registeredFiles[i];

        dispatch(addActivity(`checksum${id}`, filename, ACTIVITY_TYPE_CHECKSUM, 1));
        const checksum = await createClientChecksum(file, (progress) => {
          dispatch(updateActivity(`checksum${id}`, progress));
        });

        dispatch(updateActivity(`checksum${id}`, 1));

        const updatedFileData = await submitChecksum(registeredFiles[i].id, checksum);
      }
    }

    mutate(filesEndPoint);
  }

  function addFile(file: File, id: string, updatedFilename: string) {
    const filename = updatedFilename;
    const total = file.size;

    const request = new XMLHttpRequest();
    request.withCredentials = true;

    requests[id] = request;

    dispatch(addActivity(`upload${id}`, filename, ACTIVITY_TYPE_UPLOAD, total));

    request.open('POST', uploadEndPoint);

    const formData = new FormData();
    formData.append('id', id);
    formData.append('files', file, filename);

    request.addEventListener('load', (event) => {
      // TODO: Should we mark the file as accepted by the server here?

      // dispatch(removeActivity(id));
    });

    const uploadObject = request.upload;

    uploadObject.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        dispatch(updateActivity(`upload${id}`, event.loaded));
      }
    });

    uploadObject.addEventListener('load', (event) => {
      mutate(filesEndPoint);

      dispatch(updateActivity(`upload${id}`, total));
    });

    request.send(formData);

    mutate(filesEndPoint);
  }

  function handleAbort(id: string) {
    requests[id]?.abort();
  }

  return {
    handleFileChange,
    errors,
  };
}
