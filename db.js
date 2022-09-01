const mongoose = require('mongoose');

const File = require('./models/file');
const User = require('./models/user');

const connectionString = 'mongodb://127.0.0.1:27017/ohd-files';

mongoose.connect(connectionString);
const db = mongoose.connection;

db.on('error', err => {
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
    createUser: async (username, email, password, language) => {
        return new User({ username, email, password, language }).save();
    },
    updateFileState: async (userId, fileId, state) => {
        return User.findOneAndUpdate(
            {
                '_id': userId,
                'files._id': fileId,
            },
            {
                '$set': {
                    'files.$.state': state,
                },
            }
        );
    }
};
