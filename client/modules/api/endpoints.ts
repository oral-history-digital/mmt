const apiBasePath = '/api';

// Auth
export const loginEndPoint = `${apiBasePath}/login`;
export const logoutEndPoint = `${apiBasePath}/logout`;
export const signUpEndPoint = `${apiBasePath}/sign-up`;
export const userEndPoint = `${apiBasePath}/user`;

// Upload
export const filesEndPoint = `${apiBasePath}/files`;
export const uploadEndPoint = `${apiBasePath}/upload`;
export const submitChecksumEndPoint = `${apiBasePath}/checksum`;
export const deleteFilesEndPoint = (id: string) => `${apiBasePath}/files/${id}`;
export const abortUploadEndPoint = (id: string) => `${apiBasePath}/abort-upload/${id}`;

// Download
export const downloadEndPoint = `${apiBasePath}/download`;
export const downloadableFilesEndPoint = `${apiBasePath}/downloadable-files`;
