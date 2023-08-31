import mongoose from 'mongoose';

import File from './file.js';

export const userSchema = mongoose.Schema({
  username: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: 'en',
  },
  canUpload: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    default: null,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  files: [File.schema],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
