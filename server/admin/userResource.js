import passwordsFeature from '@adminjs/passwords';

import { User } from '../models/user.js';
import { componentLoader } from './components.js';
import getHashedPassword from '../utilities/getHashedPassword.js';

export const userResource = {
  resource: User,
  options: {
    //listProperties: ['_id', 'username', 'email', 'activated', 'language', 'createdAt', 'updatedAt', 'files'],
    //filterProperties: ['_id', 'username', 'email', 'activated', 'language', 'createdAt', 'updatedAt'],
    //editProperties: ['username', 'email', 'activated', 'language', 'files'],
    //showProperties: ['_id', 'username', 'email', 'activated', 'language', 'createdAt', 'updatedAt', 'files'],
    sort: {
      sortBy: 'updatedAt',
      direction: 'desc',
    },
    properties: {
      username: {
        description: 'Username corresponds to the directory name of upload/download files.',
      },
      activated: {
        description: 'Users have to be activated by an admin before they can log in.',
      },
      password: { isVisible: false },
      language: {
        availableValues: [
          { value: 'en', label: 'English' },
          { value: 'de', label: 'German' },
        ],
      },
      'files.transferred': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.type': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.state': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.size': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.lastModified': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.checksum_client': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.checksum_server': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.createdAt': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
      'files.updatedAt': {
        isVisible: {
          edit: false,
          show: true,
          list: false,
          filter: false,
        },
      },
    },
  },
  features: [
    passwordsFeature({
      componentLoader,
      properties: {
        encryptedPassword: 'password',
        password: 'newPassword'
      },
      hash: getHashedPassword,
  }),
  ],
};
