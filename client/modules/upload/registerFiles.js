import { filesEndPoint } from '../api';

export default async function registerFiles(data) {
  const res = await fetch(filesEndPoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: data }),
  });

  const json = await res.json();

  return json;
}
