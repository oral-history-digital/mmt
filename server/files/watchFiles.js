import path from 'node:path';
import chokidar from 'chokidar';

import config from '../config.js';
import db from '../db.js';
import createEmailService from '../email.js';

const emailService = createEmailService();

export default function watchFiles() {
  const watchGlob = path.join(config.userFilesDir, '**/downloads/*');
  const options = { ignoreInitial: true };

  chokidar.watch(watchGlob, options)
    .on('add', async (filePath) => {
      const parsedPath = path.parse(filePath);

      const { dir, base: filename } = parsedPath;

      const directories = dir.split('/');

      const username = directories[directories.length - 2];

      const user = await db.getUser({ username });

      if (!user) {
        return;
      }

      emailService.sendMailToUser(
        user.email,
        'Download file',
        `You can now download the file ${filename} from your MMT account.`,
      );
    });
}
