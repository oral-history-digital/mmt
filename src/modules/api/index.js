const apiHost = import.meta.env.VITE_API_HOST;

const options = {
    credentials: 'include',
};

export const fetcher = (url) => fetch(url, options)
    .then(res => res.json());

export const baseUrl = `${apiHost}/`;
export const downloadEndPoint = `${apiHost}/download`;
export const filesEndPoint = `${apiHost}/files`;
export const uploadEndPoint = `${apiHost}/upload`;
export const downloadableFilesEndPoint = `${apiHost}/downloadable-files`;
