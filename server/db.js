const mongoose = require('mongoose');

const File = require('./models/file');
const User = require('./models/user');
const config = require('./config');

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

module.exports = {
  getFiles: async (options = {}) => File.find(options),
  getUsers: async (options = {}) => User.find(options),
  getUser: async (options = {}) => User.findOne(options),
  createUser: async (username, email, password, language) => new User({
    username, email, password, language,
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
};
