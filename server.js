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

const injectUser = require('./injectUser');
const routes = require('./routes');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.static('public', { maxAge: '1m' }));
app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(injectUser);
app.use(compression());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

routes(app);
app.use('/', authRouter);

const port = 3000;
const host = 'localhost';

app.listen(port, host, () => {
    console.log(`App listening on http://${host}:${port}`);
});
