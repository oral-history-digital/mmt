import mongoose from 'mongoose';

import File from '../models/file.js';
import { User } from '../models/user.js';
import config from '../config.js';

console.info(`MongoDB connection string is ${config.mongo.connectionString}`);

mongoose.connect(config.mongo.connectionString);
const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB error: ${err.message}`);
  process.exit(1);
});

db.once('open', () => {
  console.log('MongoDB connection established');
  seed();
});

function seed() {
  User.find(async (err, users) => {
    if (err) {
      console.error(err);
      process.exit();
    }

    if (users.length > 0) {
      console.log(users.length);
      process.exit();
    }

    const alice = new User({
      username: 'alice',
      email: 'alice@example.com',
      // This is the SHA256 hash for value of `password`
      password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=',
      language: 'en',
      files: [
        new File({
          size: 32838722,
          type: 'audio/mpeg',
          lastModified: 1639519391407,
          name: 'police-story.mp4',
          transferred: 0,
          state: 'complete',
          checksum_server: 'c2f5a99a914f9e6d8595547f2248ddf964a5f921b79c584ce4a031f838b312e3',
          checksum_client: 'c2f5a99a914f9e6d8595547f2248ddf964a5f921b79c584ce4a031f838b312e3',
        }),
      ],
    });
    await alice.save();
    process.exit();
  });
}
