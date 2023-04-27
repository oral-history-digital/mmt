import path from 'node:path';

import config from '../config.js';

export default function getDirectoryName(username, type = 'upload') {
  switch (type) {
    case 'download':
      return path.join(
        config.userFilesDir,
        username.toLowerCase(),
        'downloads',
      );
    case 'upload':
    default:
      return path.join(
        config.userFilesDir,
        username.toLowerCase(),
        'uploads',
      );
  }
}
