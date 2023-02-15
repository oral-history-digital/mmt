const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSMongoose = require('@adminjs/mongoose');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');

const config = require('./config');
const { User } = require('./models/user');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
require('./db');

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const DEFAULT_ADMIN = {
  email: config.admin.email,
  password: config.admin.password,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const start = async () => {
  await mongoose.connect(config.mongo.connectionString);

  const adminOptions = {
    resources: [User],
    /* resources: [
      {
        resource: User,
        options: {
          listProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
          filterProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
          editProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
          showProperties: ['_id', 'username', 'email', 'language', 'createdAt'],
        },
      }
    ], */
  };

  const app = express();
  const admin = new AdminJS(adminOptions);

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

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'adminjs-sessionsecret',
    },
    null,
    {
      ...sessionOptions,
      name: 'adminjs',
    },
  );

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

  app.use(admin.options.rootPath, adminRouter);
  app.use(express.static('public', { maxAge: '1m' }));

  let stream;
  switch (app.get('env')) {
    case 'production':
      stream = fs.createWriteStream(
        path.join(__dirname, 'access.log'),
        { flags: 'a' },
      );
      app.use(morgan('combined', { stream }));
      break;
    case 'development':
    default:
      app.use(morgan('dev'));
      break;
  }

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

  app.get('*', (req, res) => {
    res.redirect('/');
  });

  app.listen(config.server.port, config.server.host, () => {
    console.log(`Express started in ${app.get('env')} mode at http://${config.server.host}:${config.server.port}; press Ctrl-C to terminate.`);
    console.log(`AdminJS started on http://localhost:${config.server.port}${admin.options.rootPath}`);
  });
};

start();
