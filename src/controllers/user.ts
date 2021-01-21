import { RequestHandler } from 'express';
import { validateOrReject } from 'class-validator';
import {
  UserModelSchema,
  UserSocilaMedia,
  IUser,
  IUserSocialMedia,
  UserBase,
} from '../models/user';
import { ErrorFromEnum, HttpError } from '../models/Errors/httpError';
import { validationResult, body } from 'express-validator';
import { UserManualData, IUserManualData } from '../models/user';

export const createUser: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const errorMessageSrverLog: string = `Manual create user: ${req.body.email}`;

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ErrorFromEnum.EXPRESS_VALIDATOR,
        errorMessageSrverLog,
        errors
      )
    );
  }
  try {
    let userToValidationReqest = new UserBase(
      req.body.email
      // req.body.lastName,
      // req.body.firstName,
      // req.body.nick
    );

    // CLASS VALIDATOR as CV
    await validateOrReject(userToValidationReqest);

    const user: IUser = new UserModelSchema(userToValidationReqest);

    const isUserExist = await user.collection.findOne({
      email: userToValidationReqest.email,
    });

    if (isUserExist) {
      return next(
        new HttpError(
          ErrorFromEnum.NODEJS_DUPLICATE_EMAIL_VALIDATOR,
          errorMessageSrverLog
        )
      );
    }
    await user.save();

    res.status(201).json({
      messaga: 'create user',
      user,
    });
  } catch (error) {
    return next(
      new HttpError(ErrorFromEnum.CATCH, errorMessageSrverLog, error)
    );
  }
};

export const updateOrCreateUserFromSocialMedia: RequestHandler = async (
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  const errorMessageSrverLog: string = `Update or create user form social media: ${req.body.email}`;

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ErrorFromEnum.EXPRESS_VALIDATOR,
        errorMessageSrverLog,
        errors
      )
    );
  }
  let userSocilaMedia = new UserSocilaMedia(
    req.body.email,
    req.body.emailVerified,
    req.body.firstName,
    req.body.lastName,
    req.body.isNewUser,
    req.body.photoId,
    req.body.providerId,
    req.body.uid
  );
  const user: IUserSocialMedia = new UserModelSchema(userSocilaMedia);
  const isUserExist = await user.collection.findOne({
    email: userSocilaMedia.email,
  });
  if (isUserExist) {
    const emailUser = { email: userSocilaMedia.email };
    let dataToUpdata;
    if (!isUserExist.isManualOwnDataUser) {
      console.log('USER WITH SOCIAL DATA');
      dataToUpdata = {
        $set: {
          email: userSocilaMedia.email,
          emailVerified: userSocilaMedia.emailVerified,
          firstName: userSocilaMedia.firstName,
          lastName: userSocilaMedia.lastName,
          isNewUser: userSocilaMedia.isNewUser,
          photoId: userSocilaMedia.photoId,
          providerId: userSocilaMedia.providerId,
          uid: userSocilaMedia.uid,
          credits: isUserExist.credits,
        },
      };
    } else {
      console.log('USER WITH OWN DATA');
      dataToUpdata = {
        $set: {
          // email: userSocilaMedia.email,  no accepted change email for user from social media
          emailVerified: userSocilaMedia.emailVerified,
          // firstName: userSocilaMedia.firstName,  no accepted change  firstName where is own data user
          // lastName: userSocilaMedia.lastName,
          isNewUser: userSocilaMedia.isNewUser,
          photoId: userSocilaMedia.photoId,
          providerId: userSocilaMedia.providerId,
          uid: userSocilaMedia.uid,
          // credits: isUserExist.credits,
        },
      };
    }
    console.log('USER UPDATE from SocialM ', userSocilaMedia.email);
    //UPDATE METHOD
    await user.collection.findOneAndUpdate(emailUser, dataToUpdata);
    res.status(201).send({ user: userSocilaMedia, msg: 'Update user from SM' });
  } else {
    // CREATE METHOD
    console.log('USER CREATE from SocialM ', userSocilaMedia.email);
    user.save();
    res.status(200).send({ user: userSocilaMedia, msg: 'Create user from SM' });
  }
  try {
  } catch (error) {
    console.log(
      'USER ERROR create or update user from SocialM',
      userSocilaMedia.email
    );
    res.status(404).send({
      user: userSocilaMedia.email,
      msg: 'Error create or update user from SM',
    });
  }
};

export const updateAndSaveEditedManualuUserData: RequestHandler = async (
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  const errorMessageSrverLog: string = `Update and save edited manual user data: ${req.body.email}`;

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ErrorFromEnum.EXPRESS_VALIDATOR,
        errorMessageSrverLog,
        errors
      )
    );
  }

  let userManualData = new UserManualData(
    req.body.nick,
    req.body.firstName,
    req.body.lastName,
    req.body.phone,
    req.body.email,
    req.body.opinion
  );
  const user: IUserManualData = new UserModelSchema(userManualData);
  // TODO: don't accept change email if user is from social media
  const isUserExist = await user.collection.findOne({
    email: userManualData.email,
  });

  if (!isUserExist) {
    return next(
      new HttpError(
        ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST,
        'try update user on not exist user from email: ' + userManualData.email
      )
    );
  }
  const emailUser = { email: userManualData.email };
  let dataToUpdata;
  if (
    isUserExist.providerId === 'facebook.com' ||
    isUserExist.providerId === 'google.com'
  ) {
    dataToUpdata = {
      $set: {
        // email: req.body.email, no accepted change email for user from social media
        nick: userManualData.nick,
        firstName: userManualData.firstName,
        lastName: userManualData.lastName,
        phone: userManualData.phone,
        opinion: userManualData.opinion,
        //  credits: isUserExist.credits,
        isManualOwnDataUser: userManualData.isManualOwnDataUser,
      },
    };
  } else {
    // TODO: use transaction to update data in mongoDB and Firebase if email is diffrent
    dataToUpdata = {
      $set: {
        email: userManualData.email,
        nick: userManualData.nick,
        firstName: userManualData.firstName,
        lastName: userManualData.lastName,
        phone: userManualData.phone,
        opinion: userManualData.opinion,
        isManualOwnDataUser: userManualData.isManualOwnDataUser,
        //  credits: isUserExist.credits,
      },
    };
  }

  console.log('USER update manual data ', userManualData.email);
  //UPDATE METHOD
  await user.collection.findOneAndUpdate(emailUser, dataToUpdata);
  res
    .status(201)
    .send({ user: userManualData, msg: 'Update user from SM to own data' });
  // console.log('PACH DATA USER', userManualData);
  // res.send({ msg: 'update user', userManualData }).status(200);
};
