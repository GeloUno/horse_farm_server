import { Router } from 'express';
import { createUser } from '../controllers/user';
import { body } from 'express-validator';

const router = Router();

router.get('/');
router.post(
  '/create',
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('firstName').trim().escape().not().isEmpty(),
  body('lastName').trim().escape().not().isEmpty(),
  createUser
);
// router.post('/');
router.patch('/');
router.delete('/');
router.put('/');

export default router;
