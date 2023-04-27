import mongoose from 'mongoose';

import { User } from './models/user.js';
import File from './models/file.js';
import config from './config.js';

console.info(`MongoDB connection string is ${config.mongo.connectionString}`);

mongoose.connect(config.mongo.connectionString);
const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB error: ${err.message}`);
  process.exit(1);
});

db.once('open', () => {
  console.log('MongoDB connection established');
});

export default {
  getFiles: async (options = {}) => File.find(options),
  getUsers: async (options = {}) => User.find(options),
  getUser: async (options = {}) => User.findOne(options),
  createUser: async (username, email, password, language) => new User({
    username,
    email,
    password,
    activated: false,
    language,
  }).save(),
  updateUser: async (username, attributes) => User.updateOne({ username }, attributes),
  setFileClientChecksum: async (userId, fileId, checksum) => User.findOneAndUpdate(
    {
      _id: userId,
      'files._id': fileId,
    },
    {
      $set: {
        'files.$.checksum_client': checksum,
      },
    },
  ),
  updateFileAttribute: async (userId, fileId, attribute, value) => User.findOneAndUpdate(
    {
      _id: userId,
      'files._id': fileId,
    },
    {
      $set: {
        [`files.$.${attribute}`]: value,
      },
    },
  ),
  deleteFile: async (userId, fileId) => User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $pull: {
        files: {
          _id: fileId,
        },
      },
    },
  ),
}
