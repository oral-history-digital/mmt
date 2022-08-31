const mongoose = require('mongoose');

const File = require('./models/file');
const User = require('./models/user');
const seed = require('./seed');

const connectionString = 'mongodb://127.0.0.1:27017/ohd-files';

mongoose.connect(connectionString);
const db = mongoose.connection;

db.on('error', err => {
    console.error(`MongoDB error: ${err.message}`);
    process.exit(1);
});

db.once('open', () => {
    console.log('MongoDB connection established');
    seed();
});

module.exports = {
    getFiles: async (options = {}) => File.find(options),
    getUsers: async (options = {}) => User.find(options),
    getUser: async (email) => User.findOne({ email }),
    createUser: async (username, email, password, language) => {
        return new User({ username, email, password, language }).save();
    },
};
