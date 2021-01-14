import { validateOrReject } from 'class-validator';
import { RequestHandler } from 'express';
import { UserModelSchema } from '../models/user';
import { IUser } from '../models/user';
import { UserBase } from '../models/user';
import { ErrorFromEnum, HttpError } from '../models/Errors/httpError';
import { validationResult } from 'express-validator';

export const createUser: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  const errorMessageSrverLog: string = `Manual create user: ${req.body.email}`;

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ErrorFromEnum.EXPRESS_VALIDATOR,
        errorMessageSrverLog + req.body.email,
        errors
      )
    );
  }
  try {
    let userToValidationReqest = new UserBase(
      req.body.email,
      req.body.lastName,
      req.body.firstName,
      req.body.nick
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
