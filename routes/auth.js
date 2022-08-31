var express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const getHashedPassword = require('../utilities/getHashedPassword');
const db = require('../db');

var router = express.Router();

async function verify(username, password, done) {
    const user = await db.getUser(username);

    if (!user) {
        return done(null, false, { message: 'Incorrect username or password'});
    }

    const hashedPassword = getHashedPassword(password);

    if (user.password !== hashedPassword) {
        return done(null, false, { message: 'Incorrect username or password'});
    }

    return done(null, user);
}

passport.use(new LocalStrategy(verify));


passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            language: user.language,
        });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        const user = req.session.passport.user;
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

router.post('/sign-up', async (req, res) => {
    const { username, email, firstName, lastName, password } = req.body;

    const existingUser = await db.getUser(username);
    if (existingUser) {
        res.status(400)
            .json({
                message: 'already registered',
            });
        return;
    }

    const hashedPassword = getHashedPassword(password);

    const user = await db.createUser(username, email, hashedPassword, 'en');

    req.login(user, (err) => {
        if (err) {
            return next(err);
        }

        const user = req.session.passport.user;
        return res.json(user);
    });
});

module.exports = router;
