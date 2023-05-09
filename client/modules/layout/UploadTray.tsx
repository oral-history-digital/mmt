import { useState } from 'react';
import classNames from 'classnames';

import { UploadsList } from '../upload';

export default function UploadTray() {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <div
      className={classNames('tray', { 'tray--is-open': isOpen })}
      onClick={() => setIsOpen(prev => !prev)}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label="Expand upload tray"
    >
      <h3 className="tray__heading">
        Uploads
      </h3>
      <UploadsList />
    </div>
  );
}
