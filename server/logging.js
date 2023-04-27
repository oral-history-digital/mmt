import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';

export default function setupLogging(app) {
  let stream;
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  console.log(import.meta.url);
  console.log(__dirname);

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
}
