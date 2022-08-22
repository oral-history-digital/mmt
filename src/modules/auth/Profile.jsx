import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import RequireAuth from './RequireAuth';
import { getUser } from './selectors';

export default function Profile() {
    const user = useSelector(getUser);
    const { t } = useTranslation();

    return (
        <RequireAuth>
            <section className="section">
                <h1 className="title is-spaced">
                    {t('modules.auth.profile.title')}
                </h1>

                <div>
                    {user.username}
                </div>
            </section>
        </RequireAuth>
    );
}
