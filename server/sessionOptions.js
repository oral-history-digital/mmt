import config from './config.js';
import sessionStore from './sessionStore.js';

export default function getSessionOptions() {
  return {
    secret: config.server.sessionSecret,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // one day
    },
  };
}
