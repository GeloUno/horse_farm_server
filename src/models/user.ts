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
  isManualDataUser: Boolean;
  createdAt: Date;

  setIsManualOwnDataUser(isData: Boolean): void;
}

export class UserBase {
  #isManualDataUser: boolean = false;

  @IsNotEmpty({ message: 'CV firstName: it not should be empty' })
  firstName: string;

  @IsNotEmpty({ message: 'CV lastName: it not should be empty' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'CV email: it not should be empty' })
  email: String;
  nick?: string;

  constructor(
    email: string,
    lastName: string,
    firstName: string,
    nick?: string
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nick = nick;
  }
  /**
   *not only socila media data
   *if user edit data
   * @memberof UserBase
   */
  set ManualDataUser(isManualData: boolean) {
    this.#isManualDataUser = isManualData;
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
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  nick: { type: String },
  isManualOwnDataUser: { type: Boolean },
  createdAt: { type: Date, default: Date.now, required: true },
});

UserSchema.methods.setIsManualOwnDataUser = function (
  this: IUser,
  isManualOwnDataUser: Boolean
) {
  this.isManualDataUser = isManualOwnDataUser;
  console.log(this);
};
export const UserModelSchema: Model<IUser> = model('User', UserSchema);
