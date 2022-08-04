const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const busboy = require('busboy');
const crypto = require('crypto');
const fs = require('fs');
const path = require('node:path');

function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex');
}

function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

function injectUser(req, res, next) {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
}

function requireAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
}

const users = [
    // This user is added to the array to avoid creating a new user on each restart
    {
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Henderson',
        email: 'alice@example.com',
        // This is the SHA256 hash for value of `password`
        password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
    },
];

const authTokens = {};

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(injectUser);

app.engine('hbs', exphbs.engine({extname: '.hbs'}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home', { signedIn: req.user ? true : false });
});

app.get('/register', (req, res) => {
    res.render('register', { signedIn: req.user ? true : false });
});

app.get('/login', (req, res) => {
    res.render('login', { signedIn: req.user ? true : false });
});

app.get('/upload', requireAuth, (req, res) => {
    res.render('upload', { signedIn: req.user ? true : false });
});

app.post('/upload', requireAuth, (req, res) => {
    bb = busboy({ headers: req.headers });

    bb.on('file', (name, file, info) => {
        const { filename, encoding } = info;

        const dir = path.join(__dirname, 'uploads',
        req.user.username.toLowerCase());
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(path.join(dir, filename));

        file.pipe(stream);

        console.log(name, file, info);
        console.log(file);

        file.on('data', (data) => {
        });

        file.on('close', () => {
            console.log(`File ${name} done`);
        });
    });

    bb.on('close', () => {
        console.log('Done parsing form!');
        res.writeHead(303, { Connection: 'close', Location: '/' });
        res.end();
    })

    req.pipe(bb);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const user = users.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    if (user) {
        const authToken = generateAuthToken();

        // Store authentication token
        authTokens[authToken] = user;

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        // Redirect user to the protected page
        res.redirect('/protected');
    } else {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger',
            signedIn: req.user ? true : false,
        });
    }
});

app.post('/logout', (req, res) => {
    const authToken = req.cookies['AuthToken'];

    console.log(authToken);

    if (authToken) {
        delete authTokens[authToken];
        res.clearCookie('AuthToken');
    }

    res.redirect('/');
});

app.post('/register', (req, res) => {
    const { username, email, firstName, lastName, password, confirmPassword }
        = req.body;

    // Check if the password and confirm password fields match
    if (password === confirmPassword) {

        // Check if user with the same email is also registered
        if (users.find(user => user.email === email)) {
            res.render('register', {
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        const hashedPassword = getHashedPassword(password);

        // Store user into the database if you are using one
        users.push({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.render('login', {
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success',
            signedIn: req.user ? true : false,
        });
    } else {
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger',
            signedIn: req.user ? true : false,
        });
    }
});

app.get('/protected', requireAuth, (req, res) => {
    res.render('protected', { signedIn: req.user ? true : false });
});


const port = 3000;
const host = 'localhost';

app.listen(port, host, () => {
    console.log(`App listening on http://${host}:${port}`);
});
