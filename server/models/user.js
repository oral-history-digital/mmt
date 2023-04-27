import mongoose from 'mongoose';

import File from './file.js';

export const userSchema = mongoose.Schema({
  username: String,
  email: String,
  language: String,
  password: String,
  activated: Boolean,
  files: [File.schema],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
