const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
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
const config = require('./config');

const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
require('./db');

const app = express();
const store = new MongoDBStore({
  uri: config.mongo.sessionConnectionString,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.log(error);
});

if (app.get('env') !== 'production') {
  app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true,
  }));
}

app.use(helmet());
app.use(express.static('public', { maxAge: '1m' }));

switch (app.get('env')) {
  case 'production':
    const stream = fs.createWriteStream(
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

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use('/', authRouter);
app.use('/', uploadRouter);
app.use('/', downloadRouter);

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(config.server.port, config.server.host, () => {
  console.log(`Express started in ${app.get('env')} mode at http://${config.server.host}:${config.server.port}; press Ctrl-C to terminate.`);
});
