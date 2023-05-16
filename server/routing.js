import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import downloadRouter from './routes/download.js';
import monitoringRouter from './routes/monitoring.js';

export default function setupRoutes(app) {
  // API routes.
  app.use('/', authRouter);
  app.use('/', uploadRouter);
  app.use('/', downloadRouter);
  app.use('/', monitoringRouter);

  // Redirect to root for all other routes because of SPA.
  app.get('*', (req, res) => {
    res.redirect('/');
  });
}
