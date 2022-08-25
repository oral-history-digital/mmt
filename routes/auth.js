var express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');

var router = express.Router();

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

function verify(username, password, done) {
    // Just a dummy. Always return the same user.

    const user = {
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Henderson',
        email: 'alice@example.com',
        // This is the SHA256 hash for value of `password`
        password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=',
        locale: 'en',
    };

    return done(null, user);
}

passport.use(new LocalStrategy(verify));


passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

passport.serializeUser(function(user,done){
    done(null, user);
});

passport.deserializeUser(function(user,done){
    done(null, user);
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        const user = { ...req.user };
        delete user.password;

        res.json(user);
    }
);

router.post('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) {
            res.json({
                message: 'failure',
            });
        }

        res.json({
            message: 'success',
        });
    });
});

router.post('/sign-up', (req, res) => {
    const { username, email, firstName, lastName, password } = req.body;

    // Check if user with the same email is also registered
    if (users.find(user => user.email === email)) {
        res.json({
            message: 'already registered',
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

    res.json({
        username,
        firstName,
        lastName,
        email,
    });
});

module.exports = router;
