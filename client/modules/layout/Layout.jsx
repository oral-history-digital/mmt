import { Outlet } from 'react-router-dom';

import { Activities } from '../activities';
import PrimaryNav from './PrimaryNav';
import Footer from './Footer';
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

            <Activities />
        </div>
    );
}
