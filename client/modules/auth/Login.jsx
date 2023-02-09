import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { loginEndPoint } from '../api';
import { ErrorMessage } from '../ui';
import { login } from './actions';

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const credentials = {
      username,
      password,
    };

    fetch(loginEndPoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        dispatch(login(data));
        const lang = data.language;
        if (lang) {
          i18n.changeLanguage(lang);
        }
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setError({
          message: err.message,
        });
      });
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <h1 className="title">
              {t('modules.auth.login.title')}
            </h1>

            {error && (
              <ErrorMessage code={error.code}>
                {error.message}
              </ErrorMessage>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="field">
                <label
                  className="label"
                  htmlFor="exampleInputEmail1"
                >
                  {t('modules.auth.login.email')}
                </label>
                <div className="control">
                  <input
                    name="email"
                    type="email"
                    className="input"
                    id="exampleInputEmail1"
                    placeholder={t('modules.auth.login.email_placeholder')}
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
              </div>
              <div className="field">
                <label
                  className="label"
                  htmlFor="exampleInputPassword1"
                >
                  {t('modules.auth.login.password')}
                </label>
                <div className="control">
                  <input
                    name="password"
                    type="password"
                    className="input"
                    id="exampleInputPassword1"
                    placeholder={t('modules.auth.login.password_placeholder')}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="field">
                <button
                  type="submit"
                  className="button is-primary"
                >
                  {t('modules.auth.login.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
