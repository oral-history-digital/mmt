export interface UploadedFile {
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
