export type UploadType = {
  id: string,
  filename: string,
  size: number,
  transferred: number,
  checksumProcessed: number,
  startDate: Date,
  request: XMLHttpRequest
};

export type UploadChangeset = {
  transferred?: number,
  checksumProcessed?: number,
};

export interface RegisteredFile {
  id: string,
  filename: string,
  name: string,
  type: string,
  size: number,
  transferred: number,
  state: string,
  lastModified: number,
  checksum_server: string,
  checksum_client: string,
  createdAt: string,
  updatedAt: string
}
