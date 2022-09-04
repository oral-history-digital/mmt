import useSWR from 'swr';

import { fetcher, downloadableFilesEndPoint } from '../modules/api';

export default function useDownloadableFiles() {
    const { data, error } = useSWR(downloadableFilesEndPoint, fetcher);

    return {
      files: data || [],
      error,
    };
}
