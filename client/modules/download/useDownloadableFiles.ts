import useSWR from 'swr';

import { fetcher, downloadableFilesEndPoint } from '../api/index.js';

export default function useDownloadableFiles() {
  const { data, error } = useSWR(downloadableFilesEndPoint, fetcher);

  return {
    files: data || [],
    error,
  };
}
