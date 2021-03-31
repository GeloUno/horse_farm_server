import { HttpError, ErrorFromEnum } from './Errors/httpError';
import { IValidator } from './Interfaces/IValidator';
import {
    IsEmail,
    IsNotEmpty,
} from 'class-validator';
import { toStringUserFrom } from './../shared/user';
import { toStringMessageServerErrorCompare } from '../shared/user';
import { CompareElementsEnum } from '../shared/CompareElementsEnum';

export class CompareEmails implements IValidator {
    private _isEmailEquials: boolean = false;
    private _isUserFromSoclialMedia: boolean;

    @IsEmail()
    @IsNotEmpty({ message: ' class _firstEmail: it not should be empty' })
    private _firstEmail;

    @IsEmail()
    @IsNotEmpty({ message: ' class _secondEmail: it not should be empty' })
    private _secondEmail;

    constructor(firstEmail: string, secondEmail: string, isUserFromScoialMedia: boolean) {
        this._firstEmail = firstEmail;
        this._secondEmail = secondEmail;
        this._isUserFromSoclialMedia = isUserFromScoialMedia;

        if (firstEmail === secondEmail) {
            this._isEmailEquials = true;
        }
        // TODO: write function is empty and is valid
        if (firstEmail === '' || firstEmail === '@') {
            this._isEmailEquials = false;
        }
        if (secondEmail === '' || secondEmail === '@') {
            this._isEmailEquials = false;
        }
    }
    isError(): boolean {
        return !this._isEmailEquials;
    }
    returnError(): HttpError {
        const userFrom = toStringUserFrom(this._isUserFromSoclialMedia);

        const messageServerError = toStringMessageServerErrorCompare(CompareElementsEnum.EMAIL, this._firstEmail, this._secondEmail, userFrom)

        return new HttpError(
            ErrorFromEnum.FIREBASE_ERROR_USER_NO_EXIST,
            messageServerError)
    }

}


