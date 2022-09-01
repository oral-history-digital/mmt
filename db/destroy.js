const mongoose = require('mongoose');

const User = require('../models/user');

require('../db');
const db = mongoose.connection;

db.on('error', err => {
    console.error(`MongoDB error: ${err.message}`);
    process.exit(1);
});

db.once('open', () => {
    console.log('MongoDB connection established');
    destroy();
});

function destroy() {
    User.deleteMany({});
}
