import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { userEndPoint } from '../api';
import { login } from './actions';

export default function CheckUser({
    children
}) {
    const [hasResponse, setHasResponse] = useState(false);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetch(userEndPoint, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                setHasResponse(true);

                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Could not load user');
                }
            })
            .then(data => {
                dispatch(login(data));
                const locale = data.locale;
                if (locale) {
                    i18n.changeLanguage(locale);
                }
            })
            .catch(error => {
                console.log(error.message);
            });

    }, []);

    if (hasResponse) {
        return children;
    }

    return (
        <div>
            Loading...
        </div>
    );
}
