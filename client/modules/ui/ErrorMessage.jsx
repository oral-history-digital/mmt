import React from 'react';
import PropTypes from 'prop-types';

export default function ErrorMessage({
  code,
  children,
}) {
  return (
    <article className="message is-danger">
      <div className="message-body">
        {code && <strong>{code}</strong>}
        {' '}
        {children}
      </div>
    </article>
  );
}

ErrorMessage.propTypes = {
  code: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

ErrorMessage.defaultProps = {
  code: null,
};
