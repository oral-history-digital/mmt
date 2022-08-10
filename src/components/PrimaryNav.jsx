import { Link } from 'react-router-dom';

export default function PrimaryNav({
    signedIn = false,
}) {
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
                    <Link className="navbar-item" to="/files">
                        Files
                    </Link>

                    <Link className="navbar-item" to="/upload">
                        Upload
                    </Link>
                </div>

                <div className="navbar-end">
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
                                    <a className="button is-primary" href="/register">
                                        <strong>Sign up</strong>
                                    </a>
                                    <a className="button is-light" href="/login">
                                        Log in
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
