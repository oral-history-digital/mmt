import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useSWR, { useSWRConfig } from 'swr';

import { userEndPoint } from '../api';
import RequireAuth from './RequireAuth';
import { getUser } from './selectors';

export default function Profile() {
  const user = useSelector(getUser);
  const { t, i18n } = useTranslation();
  const { mutate } = useSWRConfig();

  async function handleLanguageChange(event) {
    const language = event.target.value;

    const res = await fetch(userEndPoint, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language }),
    });

    const json = await res.json();
    console.log(json);

    i18n.changeLanguage(language);
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
