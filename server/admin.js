import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Resource, Database } from '@adminjs/mongoose';

import { User } from './models/user.js';
import config from './config.js';

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
  resources: [User],
  /* resources: [
    {
      resource: User,
      options: {
        listProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
        filterProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
        editProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
        showProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
      },
    }
  ], */
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

