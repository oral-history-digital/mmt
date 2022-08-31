require('./setup-config');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const fs = require('node:fs');
const path = require('node:path');

const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const credentials = require('./config').credentials;

const app = express();

if (credentials.frontend.separate) {
    app.use(cors({
        origin: `${credentials.frontend.host}:${credentials.frontend.port}`,
        credentials: true,
    }));
}

app.use(helmet());
app.use(express.static('public', { maxAge: '1m' }));

switch(app.get('env')) {
case 'production':
    const stream = fs.createWriteStream(path.join(__dirname, 'access.log'),
        { flags: 'a' });
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
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use('/', authRouter);
app.use('/', uploadRouter);

const port = 3000;
const host = 'localhost';

app.listen(port, host, () => {
    console.log(`Express started in ${app.get('env')} mode at http://${host}:${port}; press Ctrl-C to terminate.`);
});
