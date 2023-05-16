import express from 'express';

const router = express.Router();

router.get('/api/failure-route', () => {
  setImmediate(() => {
    foo(); // Produce an error for testing.
  });
});

export default router;
