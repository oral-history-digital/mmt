import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Message({
  children,
  type,
  className,
}) {
  return (
    <article className={classNames(
      'message',
      'mmt-message',
      className,
      {
        'is-danger': type === 'error',
        'is-warning': type === 'warning',
        'is-info is-light': type === 'info',
      },
    )}
    >
      <div className="message-body">
        {children}
      </div>
    </article>
  );
}

Message.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  type: PropTypes.oneOf(['error', 'info', 'warning']).isRequired,
  className: PropTypes.string,
};

Message.defaultProps = {
  className: '',
};
