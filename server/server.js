// Express modules
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';

// Mongoose module
import mongoose from 'mongoose';

// Local modules
import config from './config.js';
import watchFiles from './files/watchFiles.js';
import setupLogging from './logging.js';
import setupRoutes from './routing.js';
import getSessionOptions from './sessionOptions.js';
import createAdminRouter from './admin.js';
import './db.js';

watchFiles();

const start = async () => {
  await mongoose.connect(config.mongo.connectionString);

  const app = express();
  if (app.get('env') === 'development') {
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
  app.use(session(getSessionOptions()));
  app.use(passport.authenticate('session'));
  app.use(express.static('public', { maxAge: '1m' }));
  const { admin, router: adminRouter } = createAdminRouter(getSessionOptions());
  app.use(admin.options.rootPath, adminRouter);
  setupRoutes(app);

  app.listen(config.server.port, config.server.host, () => {
    console.log(`Express started in ${app.get('env')} mode at http://${config.server.host}:${config.server.port}; press Ctrl-C to terminate.`);
    console.log(`AdminJS started on http://localhost:${config.server.port}${admin.options.rootPath}`);
  });
};

start();
