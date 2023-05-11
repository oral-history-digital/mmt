import { filesEndPoint } from '../api';
import { RegisteredFile } from './types';

export default async function registerFiles(files: Array<File>):
  Promise<Array<RegisteredFile>> {
  const fileData = files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }));

  const res = await fetch(filesEndPoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileData }),
  });

  const json = await res.json();

  return json;
}
