import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GrUpload } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { useSWRConfig } from 'swr';

import { filesEndPoint, uploadEndPoint } from '../api';
import {
  getActivities,
  addActivity,
  updateActivity,
  removeActivity,
  ACTIVITY_TYPE_UPLOAD,
  ACTIVITY_TYPE_CHECKSUM,
} from '../activities';
import registerFiles from './registerFiles';
import createChecksum from './createChecksum';
import submitChecksum from './submitChecksum';
import { Message } from '../ui';
import { formatBytes, FILESIZE_LIMIT } from '../files';

const requests = {};

export default function UploadButton() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { mutate } = useSWRConfig();
  const [errors, setErrors] = useState(null);

  const dispatch = useDispatch();
  const allUploads = useSelector(getActivities);

  async function handleFileChange(event) {
    const { files } = event.target;
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
        addFile(file, registeredFiles[i].id);
      }
    }

    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i);
      if (file.size <= FILESIZE_LIMIT) {
        const { id, filename } = registeredFiles[i];

        dispatch(addActivity(`checksum${id}`, filename, ACTIVITY_TYPE_CHECKSUM, 1));
        const checksum = await createChecksum(file, (progress) => {
          dispatch(updateActivity(`checksum${id}`, progress));
        });

        dispatch(updateActivity(`checksum${id}`, 1));

        const updatedFileData = await submitChecksum(registeredFiles[i].id, checksum);
        console.log(updatedFileData);
      }
    }

    mutate(filesEndPoint);
  }

  function addFile(file, id) {
    console.log(`uploading file ${id}`);

    const filename = file.name;
    const total = file.size;

    const request = new XMLHttpRequest();
    request.withCredentials = true;

    requests[id] = request;

    dispatch(addActivity(`upload${id}`, filename, ACTIVITY_TYPE_UPLOAD, total));

    request.open('POST', uploadEndPoint);

    const formData = new FormData();
    formData.append('id', id);
    formData.append('files', file, file.name);

    request.addEventListener('load', (event) => {
      // TODO: Should we mark the file as accepted by the server here?
      console.log('transaction completed');

      // dispatch(removeActivity(id));
    });

    const uploadObject = request.upload;

    uploadObject.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        dispatch(updateActivity(`upload${id}`, event.loaded));
      }
    });

    uploadObject.addEventListener('load', (event) => {
      console.log('upload complete');

      mutate(filesEndPoint);

      dispatch(updateActivity(`upload${id}`, total));
    });

    request.send(formData);

    mutate(filesEndPoint);

    console.log(request);
  }

  function handleAbort(id) {
    requests[id]?.abort();
  }

  return (
    <>
      {errors && (
        <Message type="error">
          <p>
            {t('modules.upload.fileSizeError', {
              count: errors.length,
              limit: formatBytes(FILESIZE_LIMIT, lang),
            })}
          </p>
          <ul>
            {errors.map((filename) => (<li key={filename}>{filename}</li>))}
          </ul>
        </Message>
      )}
      <form className="file is-boxed">
        <label htmlFor="file-input" className="file-label">
          <input
            className="file-input"
            type="file"
            name="files"
            id="file-input"
            accept="video/*,audio/*"
            multiple
            onChange={handleFileChange}
          />
          <span className="file-cta">
            <span className="file-icon">
              <GrUpload />
            </span>
            <span className="file-label">
              {t('modules.upload.select_files')}
            </span>
          </span>
        </label>
      </form>
    </>
  );
}
