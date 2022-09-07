import { Outlet } from 'react-router-dom';

import { CheckUser } from '../auth';
import PrimaryNav from './PrimaryNav';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
    return (
        <CheckUser>
            <div className="Layout">
                <div>
                    <PrimaryNav />
                </div>

                <div className="Layout-content">
                    <Outlet />
                </div>

                <Footer />

                <Sidebar />
            </div>
        </CheckUser>
    );
}
