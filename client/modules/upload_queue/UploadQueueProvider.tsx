import { FC, ReactNode, useState } from 'react';

import UploadQueueContext from './UploadQueueContext';

type UploadQueueProviderProps = {
  children: ReactNode,
};

const UploadQueueProvider: FC<UploadQueueProviderProps> = ({
  children,
}) => {
  const [uploadQueue, setUploadQueue] = useState([]);

  return (
    <UploadQueueContext.Provider value={{ uploadQueue, setUploadQueue }}>
      {children}
    </UploadQueueContext.Provider>
  );
};

export default UploadQueueProvider;
