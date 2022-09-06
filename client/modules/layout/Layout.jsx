import { Outlet } from 'react-router-dom';

import { Activities } from '../activities';
import PrimaryNav from './PrimaryNav';

export default function Layout() {
    return (
        <div className="container">
            <PrimaryNav />
            <Outlet />

            <Activities />
        </div>
    );
}
