import { ChangeEvent, useState } from 'react';

import { FILESIZE_LIMIT } from '../files';
import { useUploadQueue } from '../upload_queue';

export default function useUploadFiles() {
  const { addFilesToUploadQueue } = useUploadQueue();
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

    addFilesToUploadQueue(withinLimitFiles);
  }

  return {
    handleFileChange,
    errors,
  };
}
