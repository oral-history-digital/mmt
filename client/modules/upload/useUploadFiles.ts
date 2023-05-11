import { ChangeEvent, useState } from 'react';

import { FILESIZE_LIMIT } from '../files';
import { useUploadQueue } from '../upload_queue';
import registerFiles from './registerFiles';

export default function useUploadFiles() {
  const { addItemToUploadQueue } = useUploadQueue();
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

    // Register files.
    // TODO: Maybe do this not all at once.
    const registeredFiles = await registerFiles(withinLimitFiles);

    // Add items to queue.
    registeredFiles.forEach((registeredFile, index) => {
      const file = withinLimitFiles[index];
      const data = {
        id: registeredFile.id,
        filename: registeredFile.filename,
        size: file.size,
        transferred: 0,
        checksumProcessed: 0,
        startDate: null,
      };
      addItemToUploadQueue(data, file);
    });
  }

  return {
    handleFileChange,
    errors,
  };
}
