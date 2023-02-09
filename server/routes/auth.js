const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const getHashedPassword = require('../utilities/getHashedPassword');
const requireAuth = require('../middleware/requireAuth');
const db = require('../db');

const router = express.Router();

async function verify(email, password, done) {
  const user = await db.getUser({ email });

  if (!user) {
    return done(null, false, { message: 'Incorrect username or password' });
  }

  const hashedPassword = getHashedPassword(password);

  if (user.password !== hashedPassword) {
    return done(null, false, { message: 'Incorrect username or password' });
  }

  return done(null, user);
}

passport.use(new LocalStrategy(verify));

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      language: user.language,
    });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

router.get('/api/user', requireAuth, async (req, res) => {
  const { username } = req.user;
  const user = await db.getUser({ username });
  res.json(user);
});

router.put('/api/user', requireAuth, async (req, res) => {
  console.log(`req.user: ${JSON.stringify(req.user)}, req.session.passport.user: ${JSON.stringify(req.session.passport.user)}`);

  const { username } = req.user;
  const attributes = req.body;
  const result = await db.updateUser(username, attributes);
  console.log(`res: ${JSON.stringify(result)}`);

  const user = await db.getUser({ username });
  res.json(user);
});

router.post(
  '/api/login',
  passport.authenticate('local'),
  (req, res) => {
    const { user } = req.session.passport;
    res.json(user);
  },
);

router.post('/api/logout', (req, res) => {
  req.logout((err) => {
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

router.post('/api/sign-up', async (req, res) => {
  const { username, email, password } = req.body;

  const existingUsername = await db.getUser({ username });
  const existingEmail = await db.getUser({ email });
  if (existingUsername || existingEmail) {
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

    const { user } = req.session.passport;
    return res.json(user);
  });
});

module.exports = router;
