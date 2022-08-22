import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { login } from '../modules/auth';

export default function Login() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
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

        const data = {
            username,
            password,
        };

        fetch('http://localhost:3000/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                dispatch(login(data));
                const locale = data.locale;
                if (locale) {
                    i18n.changeLanguage(locale);
                }
                navigate(from, { replace: true });
            });
    }

    return (
        <section className="section">
            <h1 className="title">Login</h1>

            <form onSubmit={handleFormSubmit}>
                <div className="field">
                    <label
                        className="label"
                        htmlFor="exampleInputEmail1"
                    >
                        Email address
                    </label>
                    <div className="control">
                        <input
                            name="email"
                            type="email"
                            className="input"
                            id="exampleInputEmail1"
                            placeholder="Enter email"
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
                        Password
                    </label>
                    <div className="control">
                        <input
                            name="password"
                            type="password"
                            className="input"
                            id="exampleInputPassword1"
                            placeholder="Password"
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
                        Login
                    </button>
                </div>
            </form>
        </section>
    );
}
