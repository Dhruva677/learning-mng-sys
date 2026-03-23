import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate.middleware';
import { registerHandler, loginHandler, refreshHandler, logoutHandler } from './auth.controller';

const router = Router();

router.post('/register',
  [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8 }), body('name').trim().notEmpty()],
  validate, registerHandler
);
router.post('/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate, loginHandler
);
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);

export default router;
