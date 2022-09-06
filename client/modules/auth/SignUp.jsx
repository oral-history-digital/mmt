import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { signUpEndPoint } from '../api';
import { login } from './actions';

export default function SignUp() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formElements = form.elements;

        if (formElements.password.value !== formElements.confirmPassword.value) {
            return;
        }

        const data = {
            username: formElements.username.value,
            email: formElements.email.value,
            password: formElements.password.value,
        };

        fetch(signUpEndPoint, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                dispatch(login(data));
                navigate('/');
            });
    }

    return (
        <div className="container">
            <section className="section">
                <h1 className="title">
                    {t('modules.auth.sign_up.title')}
                </h1>

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
                                required pattern="[A-Za-z0-9_-]{4,12}"
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
            </section>
        </div>
    );
}
