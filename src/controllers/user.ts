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
    const dataToUpdata = {
      $set: {
        email: req.body.email,
        emailVerified: req.body.emailVerified,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isNewUser: req.body.isNewUser,
        photoId: req.body.photoId,
        providerId: req.body.providerId,
        uid: req.body.uid,
        credits: isUserExist.credits,
      },
    };
    console.log('USER update from social media ', req.body.email);
    //UPDATE METHOD
    await user.collection.findOneAndUpdate(emailUser, dataToUpdata);
    res.status(201).send({ user: userSocilaMedia, msg: 'Update user from SM' });
  } else {
    // CREATE METHOD
    console.log('USER create from social media ', req.body.email);
    user.save();
    res.status(200).send({ user: userSocilaMedia, msg: 'Create user from SM' });
  }
  try {
  } catch (error) {
    console.log('USER ERROR create or update user from SM', req.body.email);
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

  const isUserExist = await user.collection.findOne({
    email: userManualData.email,
  });

  if (!isUserExist) {
    return next(
      new HttpError(
        ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST,
        'try update user on not exist user from email: ' + userManualData
      )
    );
  }
  console.log('PACH DATA USER', userManualData);
  res.send({ msg: 'ok' }).status(200);
};
