import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GrMultimedia } from 'react-icons/gr';
import classNames from 'classnames';

import { Avatar, getIsLoggedIn, getUser, logout } from '../auth';
import { logoutEndPoint } from '../api';

export default function PrimaryNav({
  navbarClassName,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);
  const user = useSelector(getUser);
  const { t } = useTranslation();

  function handleLogoutRequest() {
    fetch(logoutEndPoint, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(logout());
        navigate('/');
      });
  }

  function showUploadMenuItem() {
    return user?.canUpload;
  }

  return (
    <div className="container">
      <nav
        className={classNames('navbar', navbarClassName)}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <GrMultimedia
              className="icon icon--currentcolor mr-1"
              style={{ marginBottom: '4px' }}
            />
            <strong>MMT</strong>
          </Link>

          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            {showUploadMenuItem() && (
              <Link className="navbar-item" to="/upload">
                {t('modules.layout.primary-nav.upload')}
              </Link>
            )}

            <Link className="navbar-item" to="/download">
              {t('modules.layout.primary-nav.download')}
            </Link>
          </div>

          <div className="navbar-end">
            {isLoggedIn && (
              <Avatar className="navbar-item" />
            )}

            <div className="navbar-item">
              <div className="buttons">
                {isLoggedIn ? (
                  <button
                    type="button"
                    className="button"
                    onClick={handleLogoutRequest}
                  >
                    {t('modules.layout.primary-nav.logout')}
                  </button>
                ) : (
                  <>
                    <Link className="button is-primary" to="/sign-up">
                      <strong>
                        {t('modules.layout.primary-nav.sign-up')}
                      </strong>
                    </Link>
                    <Link className="button is-light" to="/login">
                      {t('modules.layout.primary-nav.login')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
