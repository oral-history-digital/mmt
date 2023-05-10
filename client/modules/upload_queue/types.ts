export type Upload = {
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
