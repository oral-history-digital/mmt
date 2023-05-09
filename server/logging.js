import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';

export default function setupLogging(app) {
  let stream;
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  switch (app.get('env')) {
    case 'production':
      const logPath = path.join(__dirname, 'access.log');
      console.log(`Logging to ${logPath}`);
      stream = fs.createWriteStream(logPath, { flags: 'a' });
      app.use(morgan('combined', { stream }));
      break;
    case 'development':
    default:
      app.use(morgan('dev'));
      break;
  }
}
