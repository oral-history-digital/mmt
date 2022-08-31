var express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const getHashedPassword = require('../utilities/getHashedPassword');
const db = require('../db');

var router = express.Router();

const users = [];

async function verify(username, password, done) {
    const user = await db.getUser(username);

    console.log(username, password);
    console.log(user);

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

    const user = {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
    };

    // Store user into the database if you are using one
    users.push(user);

    req.login(user, (err) => {
        if (err) {
            return next(err);
        }

        const userWithoutPassword = {...user};
        delete userWithoutPassword.password;

        return res.json(userWithoutPassword);
    });
});

module.exports = router;
