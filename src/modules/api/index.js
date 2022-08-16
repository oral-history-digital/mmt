const apiHost = import.meta.env.VITE_API_HOST;

export const fetcher = (...args) => fetch(...args).then(res => res.json());

export const baseUrl = `${apiHost}/`;
export const downloadEndPoint = `${apiHost}/download`;
export const filesEndPoint = `${apiHost}/files`;
export const uploadEndPoint = `${apiHost}/upload`;
export const downloadableFilesEndPoint = `${apiHost}/downloadable-files`;
