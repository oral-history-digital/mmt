import { uploadEndPoint } from '../api';

interface AddFileOptions {
  fileId: string;
  file: File;
  filename: string;
  onProgress?: (loaded: number) => void;
  onEnd?: () => void;
  onAbort?: () => void;
}

export default function addFile(options: AddFileOptions): XMLHttpRequest {
  const { fileId, file, filename, onProgress, onEnd, onAbort } = options;

  const request = new XMLHttpRequest();
  request.withCredentials = true;

  request.open('POST', uploadEndPoint);

  const formData = new FormData();
  formData.append('id', fileId);
  formData.append('files', file, filename);

  request.addEventListener('loadend', () => {
    if (typeof onEnd === 'function') {
      onEnd();
    }
  });

  request.addEventListener('abort', () => {
    if (typeof onAbort === 'function') {
      onAbort();
    }
  });

  const uploadObject = request.upload;
  uploadObject.addEventListener('progress', (event) => {
    if (event.lengthComputable && typeof onProgress === 'function') {
      onProgress(event.loaded);
    }
  });

  request.send(formData);

  return request;
}
