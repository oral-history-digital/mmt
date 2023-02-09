const mongoose = require('mongoose');

const File = require('./file');

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  language: String,
  password: String,
  files: [File.schema],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
