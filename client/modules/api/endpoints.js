const apiHost = 'http://localhost:3000/api';

export const baseUrl = `${apiHost}/`;

// Auth
export const loginEndPoint = `${apiHost}/login`;
export const logoutEndPoint = `${apiHost}/logout`;
export const signUpEndPoint = `${apiHost}/sign-up`;
export const userEndPoint = `${apiHost}/user`;

// Upload
export const filesEndPoint = `${apiHost}/files`;
export const uploadEndPoint = `${apiHost}/upload`;
export const submitChecksumEndPoint = `${apiHost}/checksum`;

// Download
export const downloadEndPoint = `${apiHost}/download`;
export const downloadableFilesEndPoint = `${apiHost}/downloadable-files`;
