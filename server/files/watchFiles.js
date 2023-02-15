const path = require('node:path');
const chokidar = require('chokidar');

const config = require('../config');
const db = require('../db');
const emailService = require('../email')();

function watchFiles() {
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

module.exports = watchFiles;
