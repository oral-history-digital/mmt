import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useFiles() {
    const { data, error } = useSWR('http://localhost:3000/files', fetcher);

    return {
      files: data || [],
      error,
    };
}
