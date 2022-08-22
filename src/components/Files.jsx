import { Link, Outlet, useMatch } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../modules/auth';

export default function Files() {
    const matchUploaded = useMatch('/files/uploaded');
    const matchDownloadable = useMatch('/files/downloadable');

    const { t } = useTranslation();

    return (
        <RequireAuth>
            <section className="section">
                <h1 className="title is-spaced">
                    {t('modules.files.title')}
                </h1>

                <div className="tabs">
                    <ul>
                        <li className={classNames({'is-active': matchUploaded})}>
                            <Link to="uploaded">
                                {t('modules.files.uploaded_files')}
                            </Link>
                        </li>
                        <li className={classNames({'is-active': matchDownloadable})}>
                            <Link to="downloadable">
                                {t('modules.files.downloadable_files')}
                            </Link>
                        </li>
                    </ul>
                </div>

                <Outlet />
            </section>
        </RequireAuth>
    );
}
