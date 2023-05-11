import { exec } from 'node:child_process';

export default function createServerChecksum(filePath, cb) {
  exec(`md5sum '${filePath}'`, (err, stdout, stderr) => {
    if (err) {
      cb(err);
    } else {
      const regex = /^\w+/;
      const match = stdout.match(regex);

      // DEBUG: the *entire* stdout and stderr (buffered)
      //console.log(`stdout: ${stdout}`);
      //console.log(`stderr: ${stderr}`);

      if (match) {
        const checksum = match[0];
        cb(null, checksum);
      }
    }
  });
}
