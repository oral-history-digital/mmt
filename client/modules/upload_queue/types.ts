export type Upload = {
  id: string,
  filename: string,
  size: number,
  transferred: number,
  startDate: Date,
  request: XMLHttpRequest
};
