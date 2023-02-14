import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const NOTIFICATION_DURATION = 2000;

export default function Notification({
  children,
  className,
}) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsHidden(true);
    }, NOTIFICATION_DURATION);
  }, []);

  return (
    <div className={classNames(
      'notification',
      'is-primary',
      className,
      { 'is-hidden': isHidden },
    )}
    >
      {children}
    </div>
  );
}

Notification.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

Notification.defaultProps = {
  className: '',
};
