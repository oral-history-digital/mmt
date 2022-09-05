import { Outlet } from 'react-router-dom';

import { UploadStatus } from '../modules/upload';
import PrimaryNav from './PrimaryNav';

export default function Layout() {
    return (
        <div className="container">
            <PrimaryNav />
            <Outlet />

            <UploadStatus />
        </div>
    );
}
