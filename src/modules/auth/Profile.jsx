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

                {user && (
                    <dl>
                        <dt><b>{t('modules.auth.profile.username')}</b></dt>
                        <dd>{user.username}</dd>

                        <dt><b>{t('modules.auth.profile.email')}</b></dt>
                        <dd>{user.email}</dd>

                        <dt><b>{t('modules.auth.profile.language')}</b></dt>
                        <dd>
                            {t(`global.languages.${user.language}`)}
                        </dd>
                    </dl>
                )}
            </section>
        </RequireAuth>
    );
}
