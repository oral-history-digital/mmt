import { abortUploadEndPoint } from '../api';

export default async function abortUpload(fileId: string) {
  await fetch(abortUploadEndPoint(fileId), {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
}
