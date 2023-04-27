import { submitChecksumEndPoint } from '../api/index.js';

export default function submitChecksum(id: string, checksum: string) {
  const req = fetch(submitChecksumEndPoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      checksum,
    }),
  }).then(
    (res) => res.json(),
  );

  return req;
}
