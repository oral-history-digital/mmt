import { createHash } from 'node:crypto';

export default function getHashedPassword(password) {
  const sha256 = createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}
