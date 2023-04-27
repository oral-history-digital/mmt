// Express modules
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import session from 'express-session';
import createMongoDBStore from 'connect-mongodb-session';
import passport from 'passport';

// Mongoose module
import mongoose from 'mongoose';

// Local modules
import config from './config.js';
import watchFiles from './files/watchFiles.js';
import createAdminRouter from './admin.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import downloadRouter from './routes/download.js';
import setupLogging from './logging.js';
import './db.js';

const MongoDBStore = createMongoDBStore(session);

watchFiles();

const start = async () => {
  await mongoose.connect(config.mongo.connectionString);

  const app = express();

  const store = new MongoDBStore({
    uri: config.mongo.sessionConnectionString,
    collection: 'sessions',
  });

  const sessionOptions = {
    secret: config.server.sessionSecret,
    store,
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // one day
    },
  };

  app.use(session(sessionOptions));

  store.on('error', (error) => {
    console.log(error);
  });

  if (app.get('env') !== 'production') {
    app.use(cors({
      origin: 'http://localhost:4000',
      credentials: true,
    }));
  }

  app.use(helmet({ contentSecurityPolicy: false }));

  setupLogging(app);

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(compression());

  app.use(session({
    secret: config.server.sessionSecret,
    store,
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // one day
    },
  }));
  app.use(passport.authenticate('session'));

  app.use('/', authRouter);
  app.use('/', uploadRouter);
  app.use('/', downloadRouter);

  const { admin, router: adminRouter } = createAdminRouter(sessionOptions);
  app.use(admin.options.rootPath, adminRouter);

  app.use(express.static('public', { maxAge: '1m' }));

  app.get('*', (req, res) => {
    res.redirect('/');
  });

  app.listen(config.server.port, config.server.host, () => {
    console.log(`Express started in ${app.get('env')} mode at http://${config.server.host}:${config.server.port}; press Ctrl-C to terminate.`);
    console.log(`AdminJS started on http://localhost:${config.server.port}${admin.options.rootPath}`);
  });
};

start();
