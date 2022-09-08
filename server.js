const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

const injectUser = require('./injectUser');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(express.static('public', { maxAge: '1m' }));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(injectUser);
app.use(compression());

app.engine('hbs', exphbs.engine({extname: '.hbs'}));

app.set('view engine', 'hbs');

routes(app);

const host = process.env.MMT_LISTEN_HOST || '127.0.0.1';
const port = process.env.MMT_LISTEN_PORT || '3000';

app.listen(port, host, () => {
    console.log(`App listening on http://${host}:${port}`);
});
