const { exec } = require('node:child_process');

module.exports = function createChecksum(filePath, cb) {
  exec(`sha256sum '${filePath}'`, (err, stdout, stderr) => {
    if (err) {
      cb(err);
    } else {
      const regex = /^\w+/;
      const match = stdout.match(regex);

      // DEBUG: the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      if (match) {
        const checksum = match[0];
        cb(null, checksum);
      }
    }
  });
};
