import PropTypes from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getIsLoggedOut } from './selectors';

export default function Authenticated({
  children,
}) {
  const isLoggedOut = useSelector(getIsLoggedOut);
  const location = useLocation();

  if (isLoggedOut) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

Authenticated.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
