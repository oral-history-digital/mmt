import mongoose from 'mongoose';
import { User } from '../models/user.js';

import config from '../config.js';

console.info(`MongoDB connection string is ${config.mongo.connectionString}`);

mongoose.connect(config.mongo.connectionString);
const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB error: ${err.message}`);
  process.exit(1);
});

db.once('open', async () => {
  console.log('MongoDB connection established');
  await destroy();
  process.exit(1);
});

function destroy() {
  return User.deleteMany({});
}
