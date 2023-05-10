import { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { UploadQueue, useUploadQueue } from '../upload_queue';

export default function UploadTray() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { uploadQueue } = useUploadQueue();

  function handleQueueChange(diff: number) {
    if (diff > 0) {
      // Queue has gotten bigger, open the tray if necessary.
      setIsOpen(true);
    }
  }

  return (
    <div className={classNames('tray', { 'tray--is-open': isOpen })}>
      <header className="tray__header">
        <h3 className="tray__title">
          {t('modules.layout.upload-tray.title')}
          {uploadQueue.length > 0 ? ` (${uploadQueue.length})` : ''}
        </h3>
        <button
          type="button"
          className="tray__handle"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Expand upload tray"
          tabIndex={0}
        >
        </button>
      </header>
      <div className="tray__body">
        <UploadQueue onChange={handleQueueChange} />
      </div>
    </div>
  );
}
