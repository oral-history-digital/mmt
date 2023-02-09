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

const requests = {};

export default function UploadButton() {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();

  const dispatch = useDispatch();
  const allUploads = useSelector(getActivities);

  async function handleFileChange(event) {
    const { files } = event.target;
    const fileData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      fileData.push({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });
    }

    const ids = await registerFiles(fileData);

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      addFile(file, ids[i]);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      const id = ids[i];

      dispatch(addActivity(`checksum${id}`, file.name, ACTIVITY_TYPE_CHECKSUM, 1));
      const checksum = await createChecksum(file, (progress) => {
        dispatch(updateActivity(`checksum${id}`, progress));
      });

      dispatch(updateActivity(`checksum${id}`, 1));

      const updatedFileData = await submitChecksum(ids[i], checksum);
      console.log(updatedFileData);
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
    <form className="file is-boxed">
      <label className="file-label">
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
  );
}