import { model, Schema, Model, Document, now } from 'mongoose';
import {
  Contains,
  IsEmail,
  isEmail,
  IsEmpty,
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';

export interface IUser extends Document, UserBase {
  isManualDataUser: boolean;
  createdAt: Date;
}
export interface IUserSocialMedia extends Document, UserSocilaMedia {
  isManualDataUser: boolean;
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
export interface IUserManualData extends Document, UserManualData {
  nick: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  opinion: string | undefined;
}

export class UserBase {
  isManualOwnDataUser: boolean;
  credits: number = 0;
  @IsEmail()
  @IsNotEmpty({ message: 'CV email: it not should be empty' })
  email: String;
  constructor(email: string, isManualOwnDataUser = false) {
    this.email = email;
    this.isManualOwnDataUser = isManualOwnDataUser;
  }
  /**if user change data by horse farm */
  // set ManualDataUser(isManualData: boolean) {
  //   this.isManualOwnDataUser = isManualData;
  // }
}

export class UserSocilaMedia extends UserBase {
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  isNewUser: boolean;
  photoId: string;
  providerId: string;
  uid: string;
  nick: string | undefined;
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
    super(email);
    this.emailVerified = emailVerified;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isNewUser = isNewUser;
    this.photoId = photoId;
    this.providerId = providerId;
    this.uid = uid;
    this.nick = nick;
  }
}

export class UserManualData extends UserBase {
  @IsNotEmpty({ message: 'CV nick: it not should be empty' })
  nick: string;
  @IsNotEmpty({ message: 'CV firstName: it not should be empty' })
  firstName: string;
  @IsNotEmpty({ message: 'CV lastName: it not should be empty' })
  lastName: string;
  @IsNotEmpty({ message: 'CV phone: it not should be empty' })
  phone: number;
  @IsNotEmpty({ message: 'CV email: it not should be empty' })
  email: string;
  opinion: string | undefined;
  constructor(
    nick: string,
    firstName: string,
    lastName: string,
    phone: number,
    email: string,
    opinion?: string | undefined
  ) {
    super(email, true);
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
  emailVerified: { type: Boolean, trim: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  isNewUser: { type: Boolean, trim: true },
  photoId: { type: String, trim: true },
  providerId: { type: String, trim: true },
  progressLearning: { type: Array },
  horseFarmLearningId: { type: Array },
  uid: { type: String, trim: true },
  nick: { type: String, trim: true },
  isManualOwnDataUser: { type: Boolean, required: true },
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
  IUser | IUserSocialMedia | IUserManualData
> = model('User', UserSchema);

// const UserSchemaSocialMedia: Schema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     validate: [isEmail, 'mDB incorrect adress email'],
//   },
//   emailVerified: { type: Boolean, required: true, trim: true },
//   firstName: { type: String, required: true, trim: true },
//   lastName: { type: String, required: true, trim: true },
//   isNewUser: { type: Boolean, required: true, trim: true },
//   photoId: { type: String, required: true, trim: true },
//   providerId: { type: String, required: true, trim: true },
//   uid: { type: String, required: true, trim: true },
//   isManualOwnDataUser: { type: Boolean },
//   nick: { type: String, trim: true }, // required ??
//   createdAt: { type: Date, default: Date.now, required: true },
// });

// export const UserSocialMediaModelSchema: Model<IUserSocialMedia> = model(
//   'User',
//   UserSchemaSocialMedia
// );
// //
