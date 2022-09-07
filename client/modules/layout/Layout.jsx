import { Outlet } from 'react-router-dom';

import PrimaryNav from './PrimaryNav';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
    return (
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
    );
}
