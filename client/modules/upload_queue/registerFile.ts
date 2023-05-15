import { registerFileEndPoint } from '../api';
import { RegisteredFile } from './types';

export default async function registerFile(file: File):
  Promise<RegisteredFile> {
  const fileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };

  const res = await fetch(registerFileEndPoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: fileData }),
  });

  const json = await res.json();

  return json;
}
