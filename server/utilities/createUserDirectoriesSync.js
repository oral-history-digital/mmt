import fs from 'fs';

import getDirectoryName from './getDirectoryName.js';

export default function createUserDirectoriesSync(username) {
  const directories = ['download', 'upload'];

  directories.forEach((type) => {
    const dir = getDirectoryName(username, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}
