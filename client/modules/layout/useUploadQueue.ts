import { useState } from 'react';

const dummyUploads = [
  {
    id: '123',
    filename: 'bach-video.mp4',
    size: 2343425,
    transferred: 3443,
  },
  {
    id: '223',
    filename: 'mozart-video.mp4',
    size: 234325,
    transferred: 3443,
  },
];

export default function useUploadQueue() {
  const [uploadQueue, setUploadQueue] = useState([]);

  return {
    uploadQueue,
    setUploadQueue,
  };
}
