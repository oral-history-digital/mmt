import { uploadEndPoint } from '../api';
import storedRequests from './requests';

interface AddFileOptions {
  fileId: string;
  file: File;
  filename: string;
  onProgress?: (loaded: number) => void;
  onEnd?: () => void;
}

export default function addFile(options: AddFileOptions) {
  const { fileId, file, filename, onProgress, onEnd } = options;

  const request = new XMLHttpRequest();
  request.withCredentials = true;

  storedRequests[fileId] = request;

  request.open('POST', uploadEndPoint);

  const formData = new FormData();
  formData.append('id', fileId);
  formData.append('files', file, filename);

  request.addEventListener('loadend', () => {
    if (typeof onEnd === 'function') {
      onEnd();
    }
  });

  const uploadObject = request.upload;
  uploadObject.addEventListener('progress', (event) => {
    if (event.lengthComputable && typeof onProgress === 'function') {
      onProgress(event.loaded);
    }
  });

  request.send(formData);
}
