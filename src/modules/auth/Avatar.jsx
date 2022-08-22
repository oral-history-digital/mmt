import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getUser, getIsLoggedIn } from './selectors';

export default function Avatar() {
    const user = useSelector(getUser);
    const isLoggedIn = useSelector(getIsLoggedIn);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div>
            <Link to="/profile">
                <b>{user.username}</b>
            </Link>
        </div>
    );
}
