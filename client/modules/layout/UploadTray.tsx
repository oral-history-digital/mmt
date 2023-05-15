import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { UploadQueue, useUploadQueue } from '../upload_queue';
import { usePrevious } from '../react_tools';

export default function UploadTray() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { combinedUploadCount } = useUploadQueue();
  const previousUploadCount = usePrevious(combinedUploadCount);

  useEffect(() => {
    if (combinedUploadCount > 0 && previousUploadCount === 0) {
      setIsOpen(true);
    }
    if (combinedUploadCount === 0
      && previousUploadCount
      && previousUploadCount > 0) {
      setIsOpen(false);
    }
  }, [combinedUploadCount]);

  return (
    <div className={classNames('tray', { 'tray--is-open': isOpen })}>
      <header className="tray__header">
        <h3 className="tray__title">
          {t('modules.layout.upload-tray.title')}
          {combinedUploadCount > 0 ? ` (${combinedUploadCount})` : ''}
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
        <UploadQueue />
      </div>
    </div>
  );
}
