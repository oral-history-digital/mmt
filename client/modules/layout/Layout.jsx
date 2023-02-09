import React from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';

import { CheckUser } from '../auth';
import { PrimaryNav } from '../nav';
import Footer from './Footer';

export default function Layout() {
  const { i18n } = useTranslation();
  const match = useMatch('/');

  const isHomepage = match ? true : false;

  return (
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
      </div>
    </CheckUser>
  );
}
