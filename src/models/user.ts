
import { model, Schema, Model, Document, now } from 'mongoose';
import {
  IsEmail,
  isEmail,
  IsNotEmpty,
} from 'class-validator';

export interface IUser extends Document, UserBase {
  isManualOwnDataUser: boolean;
  createdAt: Date;
}
export interface IUserSocialMedia extends Document, UserSocilaMedia {
  createdAt: Date;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  isNewUser: boolean;
  photoId: string;
  providerId: string;
  uid: string;
  nick: string | undefined;
}
export interface IUserManualDataEdited extends Document, UserManualDataEdited {
  _id: string,
  email: string;
  firstName: string;
  lastName: string;
  nick: string;
  phone: string;
  opinion: string | undefined;
}
interface IUserBase {
  email: String;
  uid: string;
  providerId: string;
  entityAccess: string;
  isManualOwnDataUser: boolean;
  isAccessToMakeBooking: boolean;
  setIsManualOwnDataUser: (isManualOwnDataUser: boolean) => void;
  setIsAccessToMakeBooking(isAccessToMakeBooking: boolean): void;
}

export class UserBase implements IUserBase {
  @IsEmail()
  @IsNotEmpty({ message: 'CV email: it not should be empty' })
  email: String;

  @IsNotEmpty({ message: 'CV uid: it not should be empty' })
  uid: string;

  @IsNotEmpty({ message: 'CV providerId: it not should be empty' })
  providerId: string;

  @IsNotEmpty({ message: 'CV emailVerified: it not should be empty' })
  emailVerified: boolean;
  // TODO: make emnum entitis access
  entityAccess = 'user';
  isManualOwnDataUser: boolean;
  isAccessToMakeBooking: boolean;
  credits: number = 0;
  constructor(
    email: string,
    providerId: string,
    emailVerified: boolean,
    uid: string,
    isManualOwnDataUser = false,
    isAccessToMakeBooking = false
  ) {
    this.email = email;
    this.providerId = providerId;
    this.emailVerified = emailVerified;
    this.uid = uid;
    this.isManualOwnDataUser = isManualOwnDataUser;
    this.isAccessToMakeBooking = isAccessToMakeBooking;
  }

  public setIsManualOwnDataUser(isManualOwnDataUser: boolean) {
    this.isManualOwnDataUser = isManualOwnDataUser;
  }
  public setIsAccessToMakeBooking(isAccessToMakeBooking: boolean) {
    this.isAccessToMakeBooking = isAccessToMakeBooking;
  }


}

export class UserSocilaMedia extends UserBase {
  firstName: string;
  lastName: string;
  isNewUser: boolean;
  photoId: string;
  nick: string | undefined;
  phone: string | undefined;
  opinion: string | undefined;
  constructor(
    email: string,
    emailVerified: boolean,
    firstName: string,
    lastName: string,
    isNewUser: boolean,
    photoId: string,
    providerId: string,
    uid: string,
    nick?: string
  ) {
    super(email, providerId, emailVerified, uid);
    this.firstName = firstName;
    this.lastName = lastName;
    this.isNewUser = isNewUser;
    this.photoId = photoId;
    this.nick = nick;
  }

}

export class UserManualDataEdited extends UserBase {
  @IsNotEmpty({ message: 'CV id: it not should be empty' })
  _id: string;

  @IsNotEmpty({ message: 'CV email: it not should be empty' })
  email: string;

  @IsNotEmpty({ message: 'CV nick: it not should be empty' })
  firstName: string;

  @IsNotEmpty({ message: 'CV firstName: it not should be empty' })
  lastName: string;

  @IsNotEmpty({ message: 'CV lastName: it not should be empty' })
  nick: string;
  @IsNotEmpty({ message: 'CV phone: it not should be empty' })
  phone: string;
  opinion: string | undefined;
  constructor(
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    nick: string,
    phone: string,
    uid: string,
    providerId: string,
    emailVerified: boolean,
    opinion?: string | undefined
  ) {
    super(email, providerId, emailVerified, uid, true, true);
    this._id = _id
    this.nick = nick;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.opinion = opinion;
  }
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'mDB incorrect adress email'],
    // trim: true,
  },
  // emailVerified: { type: Boolean, trim: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },// unique: true
  // isNewUser: { type: Boolean, trim: true },
  photoId: { type: String, trim: true },
  providerId: { type: String, trim: true },
  progressLearning: { type: Array },
  HoursFarmLearning: { type: Array },
  uid: { type: String, trim: true, unique: true, },
  pid: { type: String, trim: true, unique: true, },
  nick: { type: String, trim: true },
  opinion: { type: String, trim: true },
  idHorseFarmFavorite: { type: Array },
  idOpinionHorseFarm: { type: String, trim: true },
  idOpinionWebSide: { type: String, trim: true },
  isManualOwnDataUser: { type: Boolean, required: true },
  isAccessToMakeBooking: { type: Boolean, required: true },// it will be array of favorite horse farm
  entityAccess: { type: String, trim: true },
  credits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

// UserSchema.methods.setIsManualOwnDataUser = function (
//   this: IUser,
//   isManualOwnDataUser: Boolean
// ) {
//   this.isManualDataUser = isManualOwnDataUser;
//   console.log(this);
// };
export const UserModelSchema: Model<
  IUser | IUserSocialMedia | IUserManualDataEdited
> = model('User', UserSchema);
