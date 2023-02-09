// https://stackoverflow.com/questions/39112096/calculate-md5-hash-of-a-large-file-using-javascript

import CryptoJS from 'crypto-js';

export default function createChecksum(file, callback) {
  return getSHA256(file, callback);
}

function getSHA256(blob, cbProgress) {
  return new Promise((resolve, reject) => {
    const sha256 = CryptoJS.algo.SHA256.create();

    readChunked(blob, (chunk, offs, total) => {
      sha256.update(CryptoJS.enc.Latin1.parse(chunk));

      if (cbProgress) {
        cbProgress(offs / total);
      }
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        // TODO: Handle errors
        const hash = sha256.finalize();
        const hashHex = hash.toString(CryptoJS.enc.Hex);
        resolve(hashHex);
      }
    });
  });
}

function readChunked(file, chunkCallback, endCallback) {
  const fileSize = file.size;
  const chunkSize = 4 * 1024 * 1024; // 4MB
  let offset = 0;

  const reader = new FileReader();
  reader.onload = function () {
    if (reader.error) {
      endCallback(reader.error || {});
      return;
    }
    offset += reader.result.length;
    // callback for handling read chunk
    // TODO: handle errors
    chunkCallback(reader.result, offset, fileSize);
    if (offset >= fileSize) {
      endCallback(null);
      return;
    }
    readNext();
  };

  reader.onerror = function (err) {
    endCallback(err || {});
  };

  function readNext() {
    const fileSlice = file.slice(offset, offset + chunkSize);
    reader.readAsBinaryString(fileSlice);
  }
  readNext();
}
