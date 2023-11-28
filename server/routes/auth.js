import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import createEmailService from '../email.js';
import createUserDirectoriesSync from '../utilities/createUserDirectoriesSync.js';
import getHashedPassword from '../utilities/getHashedPassword.js';
import requireAuth from '../middleware/requireAuth.js';
import db from '../db.js';

const emailService = createEmailService();

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

  if (!user.activated) {
    return done(null, false, { message: 'User not activated' });
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
      activated: user.activated,
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
  // TODO: At the moment, the frontend only allows updating the language.
  const result = await db.updateUser(username, {
    email: attributes.email,
    language: attributes.language,
  });
  console.log(`res: ${JSON.stringify(result)}`);

  const user = await db.getUser({ username });
  res.json(user);
});

router.post(
  '/api/login',
  passport.authenticate('local'),
  async (req, res) => {
    const { user } = req.session.passport;
    const completeUser = await db.getUser({ username: user.username });
    res.json(completeUser);
  },
);

router.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ message: 'failure' });
    }

    res.json({ message: 'success' });
  });
});

/**
 * Sign up route.
 */
router.post('/api/sign-up', async (req, res) => {
  const { username, email, password } = req.body;

  const existingUsername = await db.getUser({ username });
  const existingEmail = await db.getUser({ email });
  if (existingUsername || existingEmail) {
    res.status(400)
      .json({ message: 'already registered' });
    return;
  }

  const hashedPassword = getHashedPassword(password);

  const user = await db.createUser(username, email, hashedPassword, 'en');
  createUserDirectoriesSync(username);
  emailService.sendMailToSupport(
    'New user',
    `The user ${username} (${email}) has just registered and needs to be activated.`,
  );

  res.json({ message: 'success' });
});

export default router;
