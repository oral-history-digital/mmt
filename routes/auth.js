var express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');

var router = express.Router();

function verify(username, password, done) {
    // Just a dummy. Always return the same user.

    console.log('verify');

    const user = {
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Henderson',
        email: 'alice@example.com',
        // This is the SHA256 hash for value of `password`
        password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
    };

    return done(null, user);
}

passport.use(new LocalStrategy(verify));

passport.serializeUser(function(user,done){
    done(null, user);
});

passport.deserializeUser(function(user,done){
    done(null, user);
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        res.json({
            message: 'succcess',
        });
    }
);

module.exports = router;
