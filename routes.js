const busboy = require('busboy');
const fs = require('fs');
const path = require('node:path');

const generateAuthToken = require('./generateAuthToken');
const getHashedPassword = require('./getHashedPassword');
const getDirectoryName = require('./getDirectoryName');
const requireAuth = require('./requireAuth');
const authTokens = require('./authTokens');

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

module.exports = function addRoutes(app) {
    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/register', (req, res) => {
        res.render('register');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/files', requireAuth, (req, res) => {
        const dir = getDirectoryName(req.user);

        let files = [];

        if (fs.existsSync(dir)) {
            files = fs.readdirSync(dir);
            console.log(files);
        }

        res.render('files', { files });
    });

    app.get('/upload', requireAuth, (req, res) => {
        res.render('upload');
    });

    app.post('/upload', requireAuth, (req, res) => {
        bb = busboy({ headers: req.headers });

        bb.on('file', (name, file, info) => {
            const { filename, encoding } = info;

            const dir = getDirectoryName(req.user);
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
            res.writeHead(303, { Connection: 'close', Location: '/files' });
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
            res.redirect('/');
        } else {
            res.render('login', {
                message: 'Invalid username or password',
                messageClass: 'alert-danger',
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
            });
        } else {
            res.render('register', {
                message: 'Password does not match.',
                messageClass: 'alert-danger',
            });
        }
    });
};
