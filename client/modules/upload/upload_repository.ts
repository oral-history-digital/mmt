const UploadRepository = {
  files: {},
  requests: {},

  addFile(id: string, file: File) {
    this.files[id] = file;
  },
  addRequest(id: string, request: XMLHttpRequest) {
    this.requests[id] = request;
  },
  getFile(id: string) {
    return this.files[id];
  },
  getRequest(id: string) {
    return this.requests[id];
  },
  removeFile(id: string) {
    delete this.files[id];
  },
  removeRequest(id: string) {
    delete this.requests[id];
  },
}

export default UploadRepository;
