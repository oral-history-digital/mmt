const busboy = require('busboy');
const fs = require('fs');
const path = require('node:path');
const bodyParser = require('body-parser');

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

let nextId = 1;

function createId() {
    return nextId++;
}

const files = [
    {
        id: 0,
        size: 32838722,
        type: 'audio/mpeg',
        lastModified: 1639519391407,
        name: 'police-story.mp4',
        transferred: 0,
        state: 'pending',
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

    app.get('/files', (req, res) => {
        res.json(files);


        const uploadDir = getDirectoryName(req.user, 'upload');
        let uploadFiles = [];
        if (fs.existsSync(uploadDir)) {
            uploadFiles = fs.readdirSync(uploadDir);
        }

        const downloadDir = getDirectoryName(req.user, 'download');
        let downloadFiles = [];
        if (fs.existsSync(downloadDir)) {
            downloadFiles = fs.readdirSync(downloadDir);
        }

        res.render('files', {
            uploadFiles,
            downloadFiles: downloadFiles.map(filename => ({
                name: filename,
                encoded: encodeURIComponent(filename),
            })),
        });
    });

    app.get('/upload', requireAuth, (req, res) => {
        res.render('upload');
    });

    app.get('/download', requireAuth, (req, res) => {
        const filename = decodeURIComponent(req.query.filename);

        const downloadDir = getDirectoryName(req.user, 'download');
        const filepath = path.join(downloadDir, filename);

        res.download(filepath);
    });

    app.post('/files', bodyParser.json(), (req, res) => {
        console.log('BODY', req.body);

        const id = createId();
        const newFile = {
            id,
            name: req.body.name,
            size: req.body.size,
            type: req.body.type,
            lastModified: req.body.lastModified,
            state: 'pending',
        };

        files.push(newFile);

        res.json(newFile);
    });

    app.post('/upload', (req, res) => {
        bb = busboy({ headers: req.headers });

        bb.on('file', (name, file, info) => {
            const { filename, encoding } = info;

            const dir = getDirectoryName({ username: 'alice' });
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
