import { useState } from 'react';
import classNames from 'classnames';

import { UploadQueue } from '../upload';

export default function UploadTray() {
  const [isOpen, setIsOpen] = useState(false);

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
      <UploadQueue />
    </div>
  );
}
