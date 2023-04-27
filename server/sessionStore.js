import createMongoDBStore from 'connect-mongodb-session';
import session from 'express-session';

import config from './config.js';

const MongoDBStore = createMongoDBStore(session);

const store = new MongoDBStore({
  uri: config.mongo.sessionConnectionString,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.log(error);
});

export default store;
