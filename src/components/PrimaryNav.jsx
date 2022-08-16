import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getUploads } from '../modules/upload/selectors';

export default function PrimaryNav({
    signedIn = false,
}) {
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
                        Files
                    </Link>

                    <Link className="navbar-item" to="/upload">
                        Upload
                    </Link>
                </div>

                <div className="navbar-end">
                    {numActiveUploads > 0 && (
                        <div className="navbar-item">
                            {numActiveUploads}
                            {' '}
                            {numActiveUploads === 1 ? 'active upload…' : 'active uploads…'}
                        </div>
                    )}
                    <div className="navbar-item">
                        <div className="buttons">
                            {signedIn ? (
                                <form method="POST" action="/logout">
                                    <button className="button" type="submit">
                                        Logout
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <Link className="button is-primary" to="/sign-up">
                                        <strong>Sign up</strong>
                                    </Link>
                                    <Link className="button is-light" to="/login">
                                        Log in
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
