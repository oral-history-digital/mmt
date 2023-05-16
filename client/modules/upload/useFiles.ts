import useSWR from 'swr';

import { fetcher, filesEndPoint } from '../api';
import { RegisteredFile } from '../upload_queue';
import {
  FILE_STATE_PENDING,
  FILE_STATE_UPLOADING,
} from './constants';

export default function useFiles() {
  const { data, error, isLoading, isValidating } = useSWR(filesEndPoint, fetcher);

  let files: Array<RegisteredFile> | null = null;

  if (data) {
    files = data.filter((file: RegisteredFile) =>
      file.state !== FILE_STATE_PENDING
      && file.state !== FILE_STATE_UPLOADING
    ).map((file: RegisteredFile) => {
      if (!file.checksum_server || !file.checksum_client) {
        return {
          ...file,
          verified: undefined,
        };
      }

      return {
        ...file,
        verified: file.checksum_client === file.checksum_server,
      };
    });
  }

  return {
    files,
    error,
    isLoading,
    isValidating,
  };
}
