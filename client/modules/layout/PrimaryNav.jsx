import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GrMultimedia } from 'react-icons/gr';

import { Avatar, getIsLoggedIn, logout } from '../auth';
import { logoutEndPoint } from '../api';

export default function PrimaryNav() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const { t } = useTranslation();

    function handleLogoutRequest() {
        fetch(logoutEndPoint, {
            method: 'POST',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                dispatch(logout());
                navigate('/');
            });
    }

    return (
        <div className="container">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/">
                        <GrMultimedia className="mr-1" />
                        <strong>OHD Files</strong>
                    </Link>

                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <Link className="navbar-item" to="/upload">
                            {t('modules.layout.primary-nav.upload')}
                        </Link>

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
