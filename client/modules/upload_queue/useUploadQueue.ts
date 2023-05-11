import { useContext } from 'react';

import UploadQueueContext from './UploadQueueContext';

export default function useUploadQueue() {
  return useContext(UploadQueueContext);
}
