import useSWR from 'swr';

import { fetcher, filesEndPoint } from '../modules/api';

export default function useFiles() {
    const { data, error } = useSWR(filesEndPoint, fetcher);

    return {
      files: data || [],
      error,
    };
}
