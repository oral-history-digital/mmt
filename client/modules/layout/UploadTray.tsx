import { useState } from 'react';
import classNames from 'classnames';

import { UploadQueue } from '../upload';

export default function UploadTray() {
  const [isOpen, setIsOpen] = useState(false);

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
          Uploads
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
      <UploadQueue onChange={handleQueueChange} />
    </div>
  );
}
