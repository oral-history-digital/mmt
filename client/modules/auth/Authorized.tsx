import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getUser } from './selectors';
import NotAuthorized from './NotAuthorized';

export default function Authorized({
  canUpload = false,
  children,
}) {
  const user = useSelector(getUser);

  if (!user) {
    return <NotAuthorized />;
  }

  let authorized = true;

  if (canUpload && !user.canUpload) {
    authorized = false;
  }

  if (authorized) {
    return children;
  } else {
    return <NotAuthorized />;
  }
}

Authorized.propTypes = {
  canUpload: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
