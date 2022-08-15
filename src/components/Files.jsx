import { Link, Outlet, useMatch } from 'react-router-dom';
import classNames from 'classnames';

export default function Files() {
    const matchUploaded = useMatch('/files/uploaded');
    const matchDownloadable = useMatch('/files/downloadable');

    return (
        <section className="section">
            <h1 className="title is-spaced">Files</h1>

            <div className="tabs">
                <ul>
                    <li className={classNames({'is-active': matchUploaded})}>
                        <Link to="uploaded">Uploaded files</Link>
                    </li>
                    <li className={classNames({'is-active': matchDownloadable})}>
                        <Link to="downloadable">Downloadable files</Link>
                    </li>
                </ul>
            </div>

            <Outlet />
        </section>
    );
}
