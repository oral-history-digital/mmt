import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorMessage } from '../ui';
import { signUpEndPoint } from '../api';

export default function SignUp() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [signedUp, setSignedUp] = useState(false);

  function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formElements = form.elements;

    if (formElements.password.value !== formElements.confirmPassword.value) {
      return;
    }

    const userData = {
      username: formElements.username.value,
      email: formElements.email.value,
      password: formElements.password.value,
    };

    fetch(signUpEndPoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setSignedUp(true);
      })
      .catch((err) => {
        setError({
          message: err.message,
        });
      });
  }

  if (signedUp) {
    return (
      <section className="section">
        <div className="container content">
          <h1 className="title">
            {t('modules.auth.sign_up.success.title')}
          </h1>

          <p>
            {t('modules.auth.sign_up.success.confirmation')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <h1 className="title">
              {t('modules.auth.sign_up.title')}
            </h1>

            {error && (
              <ErrorMessage code={error.code}>
                {error.message}
              </ErrorMessage>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="field">
                <label className="label" htmlFor="username">
                  {t('modules.auth.sign_up.username')}
                </label>
                <div className="control">
                  <input
                    name="username"
                    type="text"
                    className="input"
                    id="username"
                    required
                    pattern="[A-Za-z0-9_-]{4,12}"
                    placeholder={t('modules.auth.sign_up.username_placeholder')}
                  />
                </div>
                <p className="help">
                  {t('modules.auth.sign_up.username_help')}
                </p>
              </div>

              <div className="field">
                <label className="label" htmlFor="emailInput">
                  {t('modules.auth.sign_up.email')}
                </label>
                <div className="control">
                  <input
                    name="email"
                    type="email"
                    className="input"
                    id="emailInput"
                    placeholder={t('modules.auth.sign_up.email_placeholder')}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="passwordInput">
                  {t('modules.auth.sign_up.password')}
                </label>
                <div className="control">
                  <input
                    name="password"
                    type="password"
                    className="input"
                    id="passwordInput"
                    placeholder={t('modules.auth.sign_up.password_placeholder')}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="confirmPasswordInput">
                  {t('modules.auth.sign_up.confirm_password')}
                </label>
                <div className="control">
                  <input
                    name="confirmPassword"
                    type="password"
                    className="input"
                    id="confirmPasswordInput"
                    placeholder={t('modules.auth.sign_up.confirm_password_placeholder')}
                  />
                </div>
              </div>

              <div className="field">
                <button type="submit" className="button is-primary">
                  {t('modules.auth.sign_up.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
