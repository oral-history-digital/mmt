import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GrUser } from 'react-icons/gr';
import classNames from 'classnames';

import { getUser, getIsLoggedIn } from './selectors';

export default function Avatar({
  className,
}) {
  const user = useSelector(getUser);
  const isLoggedIn = useSelector(getIsLoggedIn);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Link to="/profile" className={classNames(className)}>
      <GrUser className="icon icon--currentcolor mr-1" />
      <b>{user.username}</b>
    </Link>
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
};

Avatar.defaultProps = {
  className: '',
};
