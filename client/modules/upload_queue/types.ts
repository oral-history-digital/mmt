export type UploadData = {
  id: string,
  filename: string,
  size: number,
  transferred: number,
  checksumProcessed: number,
  startDate: Date
};

export type UploadQueueItemType = {
  id: string,
  filename: string,
  size: number,
};

export interface RegisteredFile {
  _id: string,
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
