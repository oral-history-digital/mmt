const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    language: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
