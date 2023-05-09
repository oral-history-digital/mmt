import { createMD5 } from 'hash-wasm';
import { IHasher } from 'hash-wasm/dist/lib/WASMInterface';

const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();

function hashChunk(hasher: IHasher, chunk: Blob) {
  return new Promise<void>((resolve, reject) => {
    fileReader.onload = async (event: ProgressEvent) => {
      const result = fileReader.result as ArrayBuffer;
      const view = new Uint8Array(result);
      hasher.update(view);
      resolve();
    };

    fileReader.readAsArrayBuffer(chunk);
  });
}

const readFile = async (file: File, progressCallback: Function) => {
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

export default async function createClientChecksum(file: File,
  progressCallback: Function) {
  const hash = await readFile(file, progressCallback);
  return Promise.resolve(hash);
}
