import mongoose from 'mongoose';

const fileSchema = mongoose.Schema({
  size: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: '',
  },
  lastModified: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: '',
  },
  transferred: {
    type: Number,
    default: 0,
  },
  state: {
    type: String,
    default: 0,
  },
  checksum_server: {
    type: String,
    default: '',
  },
  checksum_client: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const File = mongoose.model('File', fileSchema);

export default File;
