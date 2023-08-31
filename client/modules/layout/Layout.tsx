import { Outlet, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';

import { CheckUser, getUser } from '../auth';
import { PrimaryNav } from '../nav';
import { UploadQueueProvider } from '../upload_queue';
import Footer from './Footer';
import UploadTray from './UploadTray';

export default function Layout() {
  const { i18n } = useTranslation();
  const match = useMatch('/');
  const user = useSelector(getUser);

  const isHomepage = match ? true : false;

  function showUploadTray() {
    return user?.canUpload;
  }

  return (
    <UploadQueueProvider>
      <CheckUser>
        <div className="layout">
          <Helmet>
            <html lang={i18n.language} />
          </Helmet>

          <div className={classNames('layout__header', {
            'has-background-primary': !isHomepage,
          })}
          >
            <PrimaryNav navbarClassName={classNames({ 'is-primary': !isHomepage })} />
          </div>

          <div className={classNames('layout__content', {
            'has-background-primary': isHomepage,
          })}
          >
            <Outlet />
          </div>

          <Footer />

          {showUploadTray() && <UploadTray />}
        </div>
      </CheckUser>
    </UploadQueueProvider>
  );
}
