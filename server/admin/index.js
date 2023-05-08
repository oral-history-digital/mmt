import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Resource, Database } from '@adminjs/mongoose';

import config from '../config.js';
import { userResource } from './userResource.js';
import { fileResource } from './fileResource.js';
import translations from './translations.js';
import { Components, componentLoader } from './components.js'

AdminJS.registerAdapter({
  Resource,
  Database,
});

const DEFAULT_ADMIN = {
  email: config.admin.email,
  password: config.admin.password,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const adminOptions = {
  componentLoader,
  dashboard: {
    component: Components.Dashboard,
  },
  //defaultTheme: noSidebar.id,
  //availableThemes: [noSidebar],
  branding: {
    companyName: 'MMT Admin',
    softwareBrothers: false,
    madeWithLove: false,
    withMadeWithLove: false,
    logo: '/ohd-logo-admin.png',
    favicon: '/favicon.png',
    appName: 'MMT',
  },
  resources: [userResource],
  locale: {
    language: 'en',
    availableLanguages: ['en', 'de'],
    localeDetection: true,
    translations,
  },
};

const admin = new AdminJS(adminOptions);

export default function createAdminRouter(sessionOptions) {
  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'adminjs-sessionsecret',
    },
    null,
    {
      ...sessionOptions,
      name: 'adminjs',
    },
  );

  return {
    admin,
    router,
  };
}
