import { createMD5 } from 'hash-wasm';

const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();

function hashChunk(hasherFn, chunk) {
  return new Promise((resolve, reject) => {
    fileReader.onload = async (e) => {
      const view = new Uint8Array(e.target.result);
      hasherFn.update(view);
      resolve();
    };

    fileReader.readAsArrayBuffer(chunk);
  });
}

const readFile = async (file, progressCallback) => {
  const hasher = await createMD5();

  const numChunks = Math.floor(file.size / chunkSize);

  for (let i = 0; i <= numChunks; i += 1) {
    const chunk = file.slice(
      chunkSize * i,
      Math.min(chunkSize * (i + 1), file.size)
    );
    await hashChunk(hasher, chunk);

    const progress = i / numChunks;

    progressCallback(progress);
  }

  const hash = hasher.digest();
  return Promise.resolve(hash);
};

export default async function createClientChecksum(file, progressCallback) {
  const hash = await readFile(file, progressCallback);
  return Promise.resolve(hash);
}
