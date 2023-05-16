import { abortUploadEndPoint } from '../api';

export default function abortUpload(fileId: string) {
  return fetch(abortUploadEndPoint(fileId), {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
}
