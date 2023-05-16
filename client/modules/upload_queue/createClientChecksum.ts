import { createMD5 } from 'hash-wasm';
import { IHasher } from 'hash-wasm/dist/lib/WASMInterface';

const CHUNK_SIZE = 64 * 1024 * 1024;
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

const readFile = async (file: File, progressCallback: (progress: number) => void) => {
  const hasher = await createMD5();

  const numChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < numChunks; i += 1) {
    const chunk = file.slice(
      CHUNK_SIZE * i,
      Math.min(CHUNK_SIZE * (i + 1), file.size)
    );
    await hashChunk(hasher, chunk);

    const progress = i / numChunks;

    progressCallback(progress);
  }

  const hash = hasher.digest();
  return Promise.resolve(hash);
};

export default async function createClientChecksum(file: File,
  progressCallback: (progress: number) => void) {
  const hash = await readFile(file, progressCallback);
  return Promise.resolve(hash);
}
