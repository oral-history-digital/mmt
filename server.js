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

const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true,
}));
app.use(helmet());
app.use(express.static('public', { maxAge: '1m' }));
app.use(morgan('combined'));

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
    console.log(`App listening on http://${host}:${port}`);
});
