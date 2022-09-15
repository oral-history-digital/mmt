import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useSWR, { useSWRConfig } from 'swr';

import RequireAuth from './RequireAuth';
import { getUser } from './selectors';

export default function Profile() {
  const user = useSelector(getUser);
  const { t, i18n } = useTranslation();
  const { mutate } = useSWRConfig();

  function handleLanguageChange(event) {
    const lang = event.target.value;

    i18n.changeLanguage(lang);
  }

  return (
    <RequireAuth>
      <section className="section">
        <div className="container">
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
                <div className="control">
                  <label className="radio">
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={i18n.language === 'en'}
                      onChange={handleLanguageChange}
                    />
                      {' '}
                      {t('global.languages.en')}
                  </label>
                  <label className="radio">
                    <input
                      type="radio"
                      name="language"
                      value="de"
                      checked={i18n.language === 'de'}
                      onChange={handleLanguageChange}
                    />
                      {' '}
                      {t('global.languages.de')}
                  </label>
                </div>
              </dd>
            </dl>
          )}
        </div>
      </section>
    </RequireAuth>
  );
}
