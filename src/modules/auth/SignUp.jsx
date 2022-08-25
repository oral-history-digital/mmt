import { useTranslation } from 'react-i18next';

export default function SignUp() {
    const { t } = useTranslation();

    return (
        <section className="section">
            <h1 className="title">
                {t('modules.auth.sign_up.title')}
            </h1>

            <form method="POST" action="/register">
                <div className="field">
                    <label className="label" for="username">
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
                    <label className="label" for="firstNameInput">
                        {t('modules.auth.sign_up.first_name')}
                    </label>
                    <div className="control">
                        <input
                            name="firstName"
                            type="text"
                            className="input"
                            id="firstNameInput"
                            placeholder={t('modules.auth.sign_up.first_name_placeholder')}
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label" for="lastNameInput">
                        {t('modules.auth.sign_up.last_name')}
                    </label>
                    <div className="control">
                        <input
                            name="lastName"
                            type="text"
                            className="input"
                            id="lastNameInput"
                            placeholder={t('modules.auth.sign_up.last_name_placeholder')}
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label" for="emailInput">
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
                    <label className="label" for="passwordInput">
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
                    <label className="label" for="confirmPasswordInput">
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
    );
}
