import { Router } from 'express';
// import  express from 'express';
import { body } from 'express-validator';
import { deleteUser } from '../controllers/user';
import {
  createUser,
  loginUser,
  createUserFromSocialMedia,
  loginUserFromSocialMedia,
  updateAndSaveEditedManualuUserData,
  getUser
} from '../controllers/user';



const router = Router();
// const router = express.Router()
// TODO: firebase SDK check email is the same from token and body is not the same throw error !!! on chache data user !!!


router.post('/createsocialmedia',
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('uid').trim().escape().not().isEmpty(),
  body('providerId').trim().escape().not().isEmpty(),
  body('photoId').trim().not().isEmpty(),
  body('firstName').trim().escape().not().isEmpty(),
  body('lastName').trim().escape().not().isEmpty(),
  body('name').trim().escape().not().isEmpty(),
  body('phoneNumber').trim().escape(),
  body('emailVerified').trim().escape(),
  createUserFromSocialMedia
);

router.post('/loginsocialmedia',
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('uid').trim().escape().not().isEmpty(),
  body('providerId').trim().escape().not().isEmpty(),
  body('photoId').trim().not().isEmpty(),
  body('firstName').trim().escape().not().isEmpty(),
  body('lastName').trim().escape().not().isEmpty(),
  body('name').trim().escape().not().isEmpty(),
  body('phoneNumber').trim().escape(),
  body('emailVerified').trim().escape(),
  loginUserFromSocialMedia
);

router.post('/create',
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('uid').trim().escape().not().isEmpty(),
  body('providerId').trim().escape().not().isEmpty(),
  body('emailVerified').trim().escape().not().isEmpty(),
  createUser
);

router.post('/login',
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('uid').trim().escape().not().isEmpty(),
  body('providerId').trim().escape().not().isEmpty(),
  body('emailVerified').trim().escape().not().isEmpty(),
  loginUser
);


router.patch('/updateEditedData',
  body('id').trim().escape().not().isEmpty(),
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('firstName').trim().escape().not().isEmpty(),
  body('lastName').trim().escape().not().isEmpty(),
  body('nick').trim().escape().not().isEmpty(),
  body('phone').trim().escape().not().isEmpty(),
  body('uid').trim().escape().not().isEmpty(),
  body('providerId').trim().escape().not().isEmpty(),
  body('emailVerified').trim().escape().not().isEmpty(),
  body('opinion').trim().escape(),
  updateAndSaveEditedManualuUserData);


router.delete('/deleteUser',
  body('id').trim().escape().not().isEmpty(),
  body('email').trim().escape().isEmail().normalizeEmail(),
  body('uid').trim().escape().not().isEmpty(),
  body('providerId').trim().escape().not().isEmpty(),
  deleteUser
);


router.get('/',
  // body('email').trim().escape().isEmail().normalizeEmail(),
  // body('uid').trim().escape().not().isEmpty(),
  // body('providerId').trim().escape().not().isEmpty(),
  getUser);

export default router;
