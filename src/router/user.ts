import { Router } from 'express';
import {
  createUser,
  updateOrCreateUserFromSocialMedia,
} from '../controllers/user';
import { body } from 'express-validator';
import { updateAndSaveEditedManualuUserData } from './../controllers/user';

const router = Router();

router.get('/');
router.post(
  '/',
  body('email').trim().escape().isEmail().normalizeEmail(),
  // body('firstName').trim().escape().not().isEmpty(),
  // body('lastName').trim().escape().not().isEmpty(),
  createUser
);
router.put(
  '/',
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('isNewUser').trim().escape().not().isEmpty(),
  body('providerId').trim().escape().not().isEmpty(),
  body('firstName').trim().escape().not().isEmpty(),
  body('lastName').trim().escape().not().isEmpty(),
  body('name').trim().escape().not().isEmpty(),
  body('emailVerified').trim().escape().not().isEmpty(),
  body('uid').trim().escape().not().isEmpty(),
  body('photoId').trim().not().isEmpty(),
  updateOrCreateUserFromSocialMedia
);
router.patch(
  '/',
  body('nick').trim().escape().not().isEmpty(),
  body('firstName').trim().escape().not().isEmpty(),
  body('lastName').trim().escape().not().isEmpty(),
  body('phone').trim().escape().not().isEmpty(),
  body('email').trim().escape().not().isEmpty(),
  body('opinion').trim().escape(),
  updateAndSaveEditedManualuUserData
);
router.delete('/');

export default router;
