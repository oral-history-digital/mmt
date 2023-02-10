import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { userEndPoint } from '../api';
import { login, logout } from './actions';

export default function CheckUser({
  children,
}) {
  const [hasResponse, setHasResponse] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch(userEndPoint, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        setHasResponse(true);

        if (response.ok) {
          return response.json();
        }
        throw new Error('Could not load user');
      })
      .then((data) => {
        dispatch(login(data));
        const lang = data.language;
        if (lang) {
          i18n.changeLanguage(lang);
        }
      })
      .catch((error) => {
        dispatch(logout());
        console.log(error.message);
      });
  }, []);

  if (hasResponse) {
    return children;
  }

  return (
    <div>
      Loading...
    </div>
  );
}

CheckUser.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
