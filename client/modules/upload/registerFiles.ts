import { filesEndPoint } from '../api/index.js';
import { UploadedFile } from './types.js';

export default async function registerFiles(files: Array<UploadedFile>) {
  const res = await fetch(filesEndPoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files }),
  });

  const json = await res.json();

  return json;
}
