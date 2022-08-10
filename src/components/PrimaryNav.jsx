export default function PrimaryNav({
    signedIn = false,
}) {
    return (
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="/">
                    <strong>OHD Files</strong>
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <a class="navbar-item" href="/files">
                        Files
                    </a>

                    <a class="navbar-item" href="/upload">
                        Upload
                    </a>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            {signedIn ? (
                                <form method="POST" action="/logout">
                                    <button class="button" type="submit">
                                        Logout
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <a class="button is-primary" href="/register">
                                        <strong>Sign up</strong>
                                    </a>
                                    <a class="button is-light" href="/login">
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
