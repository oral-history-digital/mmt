import { Outlet } from 'react-router-dom';

import PrimaryNav from './PrimaryNav';

export default function Layout() {
    return (
        <div className="container">
            <PrimaryNav />
            <Outlet />
        </div>
    );
}
