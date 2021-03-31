import { NextFunction, Request, Response, RequestHandler } from 'express';
import { validateOrReject } from 'class-validator';
import {
  UserModelSchema,
  UserSocilaMedia,
  IUser,
  IUserSocialMedia,
  UserBase,
} from '../models/user';
import { ErrorFromEnum, HttpError } from '../models/Errors/httpError';
import { UserManualDataEdited, IUserManualDataEdited } from '../models/user';
import { ValidatorExpressChecker } from './ValidatorExpressChecker';
import { UserFirebase } from '../models/UserFirebase';
import { CompareEmails } from '../models/CompareEmail';
import { UserMongoDB } from '../models/UserMongoDB';
import { ErrorsLogMessangeBuilder } from '../models/ServerLog';
import { UserActions } from "../models/UserActions";
import { CompareId } from '../models/CompareId';



//
// CREATE USER MANUAL BY PASSWORD
//

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

  const valdatorExpressCheker = new ValidatorExpressChecker(req, false, UserActions.CREATE_USER);
  await validateOrReject(valdatorExpressCheker);
  const isError = valdatorExpressCheker.isError();

  let emailFromBodyRequest: string = req.body?.email;
  let uidFirebaseFromBodyRequest: string = req.body?.uid;

  emailFromBodyRequest && (valdatorExpressCheker.email = emailFromBodyRequest)

  if (isError) {
    return next(valdatorExpressCheker.returnError());
  }

  try {

    const userFirebase = new UserFirebase(uidFirebaseFromBodyRequest)
    await validateOrReject(userFirebase);

    const { email: emailUserFirebase } = await userFirebase.getUserById()

    const compareEmails = new CompareEmails(emailUserFirebase!, emailFromBodyRequest!, false)

    await validateOrReject(compareEmails);

    if (compareEmails.isError()) {
      return next(compareEmails.returnError());
    }

  } catch (error) {
    const errorMessangeLog = new ErrorsLogMessangeBuilder(error, emailFromBodyRequest, UserActions.CREATE_USER);
    return next(new HttpError(
      ErrorFromEnum.FIREBASE_ERROR_USER_NO_EXIST,
      `${errorMessangeLog}`,
    ))
  }

  try {
    let userCreate = new UserBase(
      req.body.email,
      req.body.providerId,
      req.body.emailVerified,
      req.body.uid,
    );

    // CLASS VALIDATOR as CV
    await validateOrReject(userCreate);

    userCreate.setIsAccessToMakeBooking(false);
    userCreate.setIsManualOwnDataUser(false);

    const user: IUser = new UserModelSchema(userCreate) as IUser;

    const userMongoDB = new UserMongoDB(user);
    await validateOrReject(userMongoDB);

    const isUserExist = await userMongoDB.getUserByEmail();
    if (isUserExist) {
      const errorMessageSrverLog = new ErrorsLogMessangeBuilder(`MongoDB user is already exist, DUPLICATE EMAIL`, emailFromBodyRequest, UserActions.CREATE_USER)
      return next(
        new HttpError(
          ErrorFromEnum.NODEJS_DUPLICATE_EMAIL_VALIDATOR,
          `${errorMessageSrverLog}`
        )
      );
    }

    const dataUserMongoDB = await userMongoDB.saveUser();

    console.log('USER create by password: ', dataUserMongoDB.email)
    res.status(201).json({
      messaga: 'create user',
      user: {
        id: dataUserMongoDB._id,
        email: dataUserMongoDB.email,
        credits: dataUserMongoDB.credits,
        isAccessToMakeBooking: dataUserMongoDB.isAccessToMakeBooking,
        isManualOwnDataUser: dataUserMongoDB.isManualOwnDataUser,
        entityAccess: dataUserMongoDB.entityAccess,
      }
    });

  } catch (error) {

    const errorMessageSrverLog = `MONGODB manual create user : ${emailFromBodyRequest} ` + error.message;
    return next(
      new HttpError(ErrorFromEnum.CATCH, errorMessageSrverLog,
        error
      )
    );
  }
};

//
// LOGIN USER MANUAL BY PASSWORD
//

export const loginUser: RequestHandler = async (req, res, next) => {
  let emailFromBodyRequest: string = req.body?.email;
  let uidFirebaseUserFromBodyRequest: string = req.body?.uid;

  try {
    const valdatorExpressCheker = new ValidatorExpressChecker(req, false, UserActions.LOGIN_USER);
    await validateOrReject(valdatorExpressCheker);
    const isError = valdatorExpressCheker.isError();

    emailFromBodyRequest && (valdatorExpressCheker.email = emailFromBodyRequest)

    if (isError) {
      return next(valdatorExpressCheker.returnError());
    }

    const userFirebase = new UserFirebase(uidFirebaseUserFromBodyRequest)
    await validateOrReject(userFirebase);

    const { email: emailUserFirebase, uid: idUserFirebase } = await userFirebase.getUserById()
    try {


      const compareEmails = new CompareEmails(emailUserFirebase!, emailFromBodyRequest!, false)

      await validateOrReject(compareEmails);

      if (compareEmails.isError()) {
        return next(compareEmails.returnError());
      }



    } catch (error) {
      const errorMessangeLog = new ErrorsLogMessangeBuilder(error, emailFromBodyRequest, UserActions.LOGIN_USER);

      return next(new HttpError(
        ErrorFromEnum.FIREBASE_ERROR_USER_NO_EXIST,
        `${errorMessangeLog}`,
      ))
    }


    let userLogin = new UserBase(
      req.body.email,
      req.body.providerId,
      req.body.emailVerified,
      req.body.uid,
    );

    // CLASS VALIDATOR as CV
    await validateOrReject(userLogin);

    const user: IUser = new UserModelSchema(userLogin) as IUser;

    const userMongoDB = new UserMongoDB(user);
    await validateOrReject(userMongoDB);

    const dataUserMongoDB = await userMongoDB.getUserByEmail();
    if (!dataUserMongoDB) {
      const errorMessageSrverLog = new ErrorsLogMessangeBuilder(`MongoDB user is NOT EXIST ,try to login to user not exist in mongoDB`, emailFromBodyRequest, UserActions.LOGIN_USER)
      return next(
        new HttpError(
          ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST,
          `${errorMessageSrverLog}`
        )
      );
    }

    const compareUserIdFirebaseAndMongoDB = new CompareId(dataUserMongoDB.uid, idUserFirebase, false);

    await validateOrReject(compareUserIdFirebaseAndMongoDB);

    if (compareUserIdFirebaseAndMongoDB.isError()) {
      return next(compareUserIdFirebaseAndMongoDB.returnError())
    }

    console.log('USER Login by password: ', dataUserMongoDB.email)
    res.status(201).json({
      messaga: 'Login user',
      user: {
        id: dataUserMongoDB._id,
        email: dataUserMongoDB.email,
        credits: dataUserMongoDB.credits,
        phone: dataUserMongoDB?.phone,
        nick: dataUserMongoDB?.nick,
        firstName: dataUserMongoDB?.firstName,
        lastName: dataUserMongoDB?.lastName,
        isAccessToMakeBooking: dataUserMongoDB.isAccessToMakeBooking,
        isManualOwnDataUser: dataUserMongoDB.isManualOwnDataUser,
        entityAccess: dataUserMongoDB.entityAccess,
      }
    });

  } catch (error) {

    const errorMessageSrverLog = `MONGODB manual login user : ${emailFromBodyRequest} ` + error.message;
    return next(
      new HttpError(ErrorFromEnum.CATCH, errorMessageSrverLog,
        error
      )
    );
  }
};

//
// CREATE USERE FROM SOCILA MEDIA
//

export const createUserFromSocialMedia: RequestHandler = async (req, res, next) => {

  let emailFromBodyRequest: string = req.body?.email;
  let uidFirebaseUserFromBodyRequest: string = req.body?.uid;

  try {
    const valdatorExpressCheker = new ValidatorExpressChecker(req, true, UserActions.CREATE_USER);
    await validateOrReject(valdatorExpressCheker);
    const isError = valdatorExpressCheker.isError();

    emailFromBodyRequest && (valdatorExpressCheker.email = emailFromBodyRequest)

    if (isError) {
      return next(valdatorExpressCheker.returnError());
    }

    const userFirebase = new UserFirebase(uidFirebaseUserFromBodyRequest)
    await validateOrReject(userFirebase);

    const { email: emailUserFirebase, uid: uidUserFirebase } = await userFirebase.getUserById()

    try {
      const compareEmails = new CompareEmails(emailUserFirebase!, emailFromBodyRequest!, true)

      await validateOrReject(compareEmails);

      if (compareEmails.isError()) {
        return next(compareEmails.returnError());
      }



    } catch (error) {
      const errorMessangeLog = new ErrorsLogMessangeBuilder(error, emailFromBodyRequest, UserActions.CREATE_USER);

      return next(new HttpError(
        ErrorFromEnum.FIREBASE_ERROR_USER_NO_EXIST,
        `${errorMessangeLog}`,
      ))
    }


    let userCreateSocialMedia = new UserSocilaMedia(
      req.body.email,
      req.body.emailVerified,
      req.body.firstName,
      req.body.lastName,
      req.body.isNewUser,
      req.body.photoId,
      req.body.providerId,
      req.body.uid,
      req.body?.nick,
    );

    userCreateSocialMedia.setIsAccessToMakeBooking(false);
    userCreateSocialMedia.setIsManualOwnDataUser(false);

    // CLASS VALIDATOR as CV
    await validateOrReject(userCreateSocialMedia);

    const user: IUserSocialMedia = new UserModelSchema(userCreateSocialMedia) as IUserSocialMedia;

    const userMongoDB = new UserMongoDB(user);
    await validateOrReject(userMongoDB);

    const isUserMongoDB = await userMongoDB.getUserByEmail();

    if (isUserMongoDB) {
      const errorMessageSrverLog = new ErrorsLogMessangeBuilder(`MongoDB  try to CREATE USER on existing user in mongoDB`, emailFromBodyRequest, UserActions.LOGIN_USER)
      return next(
        new HttpError(
          ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST,
          `${errorMessageSrverLog}`
        )
      );
    }

    const dataUserMongoDB: IUserSocialMedia = (await userMongoDB.saveUser()) as IUserSocialMedia;

    console.log('USER Create by socilaMedia: ', dataUserMongoDB.email)
    res.status(201).json({
      messaga: 'Create user SM',
      user: {
        id: dataUserMongoDB._id,
        email: dataUserMongoDB.email,
        emailVerified: dataUserMongoDB.emailVerified,
        firstName: dataUserMongoDB.firstName,
        lastName: dataUserMongoDB.lastName,
        isNewUser: dataUserMongoDB.isNewUser,
        photoId: dataUserMongoDB.photoId,
        providerId: dataUserMongoDB.providerId,
        uid: dataUserMongoDB.uid,
        isManualOwnDataUser: dataUserMongoDB.isManualOwnDataUser,
        isAccessToMakeBooking: dataUserMongoDB.isAccessToMakeBooking,
        nick: dataUserMongoDB.nick,
      }
    });
  } catch (error) {

    const errorMessageSrverLog = `MONGODB socialMedia Create user : ${emailFromBodyRequest} ` + error.message;
    return next(
      new HttpError(ErrorFromEnum.CATCH, errorMessageSrverLog,
        error
      )
    );
  }
};

//
// LOGIN USER BY SOCIAL MEDIA
//

export const loginUserFromSocialMedia: RequestHandler = async (req, res, next) => {

  let emailFromBodyRequest: string = req.body?.email;
  let uidFirebaseUserFromBodyRequest: string = req.body?.uid;

  try {
    const valdatorExpressCheker = new ValidatorExpressChecker(req, true, UserActions.LOGIN_USER);
    await validateOrReject(valdatorExpressCheker);
    const isError = valdatorExpressCheker.isError();

    emailFromBodyRequest && (valdatorExpressCheker.email = emailFromBodyRequest)

    if (isError) {
      return next(valdatorExpressCheker.returnError());
    }

    const userFirebase = new UserFirebase(uidFirebaseUserFromBodyRequest)
    await validateOrReject(userFirebase);

    const { email: emailUserFirebase, uid: idUserFirebase } = await userFirebase.getUserById()

    try {
      const compareEmails = new CompareEmails(emailUserFirebase!, emailFromBodyRequest!, true)

      await validateOrReject(compareEmails);

      if (compareEmails.isError()) {
        return next(compareEmails.returnError());
      }



    } catch (error) {
      const errorMessangeLog = new ErrorsLogMessangeBuilder(error, emailFromBodyRequest, UserActions.LOGIN_USER);

      return next(new HttpError(
        ErrorFromEnum.FIREBASE_ERROR_USER_NO_EXIST,
        `${errorMessangeLog}`,
      ))
    }


    let userLoginSocialMedia = new UserSocilaMedia(
      req.body.email,
      req.body.emailVerified,
      req.body.firstName,
      req.body.lastName,
      req.body.isNewUser,
      req.body.photoId,
      req.body.providerId,
      req.body.uid,
      req.body?.nick,
    );

    // CLASS VALIDATOR as CV
    await validateOrReject(userLoginSocialMedia);

    const user: IUserSocialMedia = new UserModelSchema(userLoginSocialMedia) as IUserSocialMedia;

    const userMongoDB = new UserMongoDB(user);
    await validateOrReject(userMongoDB);

    const isUserMongoDB = await userMongoDB.getUserByFirebaseId();
    if (!isUserMongoDB) {
      const errorMessageSrverLog = new ErrorsLogMessangeBuilder(`MongoDB try to LOGIN on NOT existing user in mongoDB`, emailFromBodyRequest, UserActions.LOGIN_USER)
      return next(
        new HttpError(
          ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST,
          `${errorMessageSrverLog}`
        )
      );
    }

    const compareUserIdFirebaseAndMongoDB = new CompareId(isUserMongoDB.uid, idUserFirebase, true);

    await validateOrReject(compareUserIdFirebaseAndMongoDB);

    if (compareUserIdFirebaseAndMongoDB.isError()) {
      return next(compareUserIdFirebaseAndMongoDB.returnError())
    }
    //TODO: use it ? lastSignInTime:
    //TODO: use it ? lastRefreshTime:


    console.log('USER Login by socilaMedia: ', isUserMongoDB.email)
    res.status(200).json({
      messaga: 'Login user SM',
      user: {
        id: isUserMongoDB._id,
        email: isUserMongoDB.email,
        emailVerified: isUserMongoDB.emailVerified,
        firstName: isUserMongoDB.firstName,
        lastName: isUserMongoDB.lastName,
        isNewUser: isUserMongoDB.isNewUser,
        photoId: isUserMongoDB.photoId,
        providerId: isUserMongoDB.providerId,
        uid: isUserMongoDB.uid,
        phone: isUserMongoDB.phone,
        isManualOwnDataUser: isUserMongoDB.isManualOwnDataUser,
        isAccessToMakeBooking: isUserMongoDB.isAccessToMakeBooking,
        nick: isUserMongoDB.nick,
      }
    });
  } catch (error) {

    const errorMessageSrverLog = `MONGODB socialMedia Login user : ${emailFromBodyRequest} ` + error.message;
    return next(
      new HttpError(ErrorFromEnum.CATCH, errorMessageSrverLog,
        error
      )
    );
  }
};


//
// UPDATE USER DATA
//

export const updateAndSaveEditedManualuUserData: RequestHandler = async (
  req,
  res,
  next
) => {


  let emailFromBodyRequest: string = req.body?.email;
  let uidFirebaseUserFromBodyRequest: string = req.body?.uid;
  const isManualUserProvider: boolean = (req.body.providerId === 'password') ? (true) : (false)
  try {
    const valdatorExpressCheker = new ValidatorExpressChecker(req, isManualUserProvider, UserActions.UPDATE_USER);
    await validateOrReject(valdatorExpressCheker);
    const isError = valdatorExpressCheker.isError();

    emailFromBodyRequest && (valdatorExpressCheker.email = emailFromBodyRequest)

    if (isError) {
      return next(valdatorExpressCheker.returnError());
    }

    const userFirebase = new UserFirebase(uidFirebaseUserFromBodyRequest)
    await validateOrReject(userFirebase);

    const { email: emailUserFirebase, uid: uidUserFirebase } = await userFirebase.getUserById()

    try {
      const compareEmails = new CompareEmails(emailUserFirebase!, emailFromBodyRequest!, true)

      await validateOrReject(compareEmails);

      if (compareEmails.isError()) {
        return next(compareEmails.returnError());
      }



    } catch (error) {
      const errorMessangeLog = new ErrorsLogMessangeBuilder(error, emailFromBodyRequest, UserActions.UPDATE_USER);

      return next(new HttpError(
        ErrorFromEnum.FIREBASE_ERROR_USER_NO_EXIST,
        `${errorMessangeLog}`,
      ))
    }

    let userManualData = new UserManualDataEdited(
      req.body.id,
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      req.body.nick,
      req.body.phone,
      req.body.uid,
      req.body.providerId,
      req.body.emailVerified,
      req.body.opinion
    );

    userManualData.setIsAccessToMakeBooking(true);
    userManualData.setIsManualOwnDataUser(true);

    // CLASS VALIDATOR as CV
    await validateOrReject(userManualData);

    const user: IUserManualDataEdited = new UserModelSchema(userManualData) as IUserManualDataEdited;

    const userMongoDB = new UserMongoDB(user);
    await validateOrReject(userMongoDB);

    const isUserMongoDB = await userMongoDB.getUserByMongoDBId();

    if (!isUserMongoDB) {
      const errorMessageSrverLog = new ErrorsLogMessangeBuilder(`MongoDB try to UPDATE DATA on NOT existing user in mongoDB`, emailFromBodyRequest, UserActions.UPDATE_USER)
      return next(
        new HttpError(
          ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST,
          `${errorMessageSrverLog}`
        )
      );
    }

    const compareUserIdFirebaseAndMongoDB = new CompareId(isUserMongoDB.uid, uidUserFirebase, isManualUserProvider);

    await validateOrReject(compareUserIdFirebaseAndMongoDB);

    if (compareUserIdFirebaseAndMongoDB.isError()) {
      return next(compareUserIdFirebaseAndMongoDB.returnError())
    }

    const compareIdUserMongoDBAndBodyId = new CompareId(isUserMongoDB._id.toString(), userManualData._id, isManualUserProvider);

    await validateOrReject(compareIdUserMongoDBAndBodyId);

    if (compareIdUserMongoDBAndBodyId.isError()) {
      return next(compareIdUserMongoDBAndBodyId.returnError())
    }


    const data = await userMongoDB.findOneAndUpdate(UserActions.UPDATE_USER)

    console.log('USER Updated : ', userManualData.email)
    res.status(200).json({
      msg: 'Update user data',
      user: {
        firstName: userManualData.firstName,
        lastName: userManualData.lastName,
        phone: userManualData.phone,
        nick: userManualData.nick,
        opinion: userManualData.opinion,
        email: userManualData.email,
      },
    });

  } catch (error) {

    const errorMessageSrverLog = `MONGODB update user data: ${emailFromBodyRequest} ` + error.message;
    return next(
      new HttpError(ErrorFromEnum.CATCH, errorMessageSrverLog,
        error
      )
    );
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {

}

export const getUser: RequestHandler = async (req, res, next) => {

  console.log('USER GET NO ACCEPTED METHOD: ',)
  console.log('GET query', req.query)
  console.log('GET body', req.body)

  // const errorMessageSrverLog: string = `USER GET user: ${req.body.email}`;
  //TODO: ADD TO DATA BASE LOCK IP

  res.status(401).json({
    //  FIXME: CZHANGE TO CURRENT DATA
    messaga: 'user access denied',

  });

  // admin.auth().updateUser(userCreate.uid, {
  //   phoneNumber:'+48507171999',
  // })
