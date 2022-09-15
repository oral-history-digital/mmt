import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import { CheckUser } from '../auth';
import PrimaryNav from './PrimaryNav';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
  const { i18n } = useTranslation();

  return (
    <CheckUser>
      <div className="Layout">
        <Helmet>
          <html lang={i18n.language} />
        </Helmet>

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
