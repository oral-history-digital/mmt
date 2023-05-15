import useSWR from 'swr';

import { fetcher, filesEndPoint } from '../api';
import {
  FILE_STATE_PENDING,
  FILE_STATE_UPLOADING,
} from './constants';
import { UploadedFile } from './types';

export default function useFiles() {
  const { data, error } = useSWR(filesEndPoint, fetcher);

  let files: Array<UploadedFile> | null = null;

  if (data) {
    files = data.filter((file: UploadedFile) =>
      file.state !== FILE_STATE_PENDING
      && file.state !== FILE_STATE_UPLOADING
    );
  }

  return {
    files,
    error,
  };
}
