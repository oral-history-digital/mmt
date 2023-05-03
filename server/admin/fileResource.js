import File from '../models/file.js';

export const fileResource = {
  resource: File,
  options: {
    sort: {
      sortBy: 'updatedAt',
      direction: 'desc',
    },
    listProperties: ['_id', 'name', 'createdAt'],
    showProperties: ['_id', 'name', 'createdAt'],
    /*properties: {
      user: {
        type: 'belongsTo',
        ref: 'User',
      },
    },*/
  },
};
