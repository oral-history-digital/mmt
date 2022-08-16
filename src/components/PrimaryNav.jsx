import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getUploads } from '../modules/upload/selectors';

export default function PrimaryNav({
    signedIn = false,
}) {
    const { t } = useTranslation();

    const uploads = Object.values(useSelector(getUploads));

    const numActiveUploads = uploads.filter(
        upload => upload.total !== upload.transferred
    ).length;

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to="/">
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
                    <Link className="navbar-item" to="/files/uploaded">
                        {t('modules.layout.primary-nav.files')}
                    </Link>

                    <Link className="navbar-item" to="/upload">
                        {t('modules.layout.primary-nav.upload')}
                    </Link>
                </div>

                <div className="navbar-end">
                    {numActiveUploads > 0 && (
                        <div className="navbar-item">
                            {t('modules.layout.primary-nav.uploadWithCount', { count: numActiveUploads })}…
                        </div>
                    )}
                    <div className="navbar-item">
                        <div className="buttons">
                            {signedIn ? (
                                <form method="POST" action="/logout">
                                    <button className="button" type="submit">
                                        {t('modules.layout.primary-nav.logout')}
                                    </button>
                                </form>
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
    );
}
