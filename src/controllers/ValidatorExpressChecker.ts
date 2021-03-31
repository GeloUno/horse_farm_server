import { Request } from 'express';
import { ErrorFromEnum, HttpError } from '../models/Errors/httpError';
import { validationResult, ValidationError, Result } from 'express-validator';
import { IValidator } from '../models/Interfaces/IValidator';
import { UserActions } from '../models/UserActions';
import {
    IsNotEmpty,
} from 'class-validator';

export class ValidatorExpressChecker implements IValidator {

    private errors: Result<ValidationError>;
    private isUserFromSocialMedia: boolean;
    private userAction: UserActions;
    private _email: string = 'NO email in BODY';
    private errorMessageSrverLog = '';
    @IsNotEmpty({ message: 'ValidatorExpressChecker req: it not should be empty' })
    private _req: Request;

    constructor(req: Request, isUserFromSocialMedia: boolean = false, userAction: UserActions) {
        this._req = req;
        this.isUserFromSocialMedia = isUserFromSocialMedia;
        this.userAction = userAction;
        this.errors = validationResult(this._req);
        this.buildErrorMessage();
    }

    isError = (): boolean => {
        if (!this.errors.isEmpty()) {
            return true;
        }
        return false;

    };
    private buildErrorMessage = () => {
        this.isUserFromSocialMedia ? (this.errorMessageSrverLog = `EXPRESS_VALIDATOR Social Media ${this.userAction} user: ${this._email}`) : (
            this.errorMessageSrverLog = `EXPRESS_VALIDATOR Manual ${this.userAction} user: ${this._email}`);
    };

    public set email(email: string) {
        if (email !== "@") {
            this._email = email;
            this.buildErrorMessage();
        }
    }

    public get email(): string {
        return this._email;
    }


    returnError = (): HttpError => {
        return new HttpError(
            ErrorFromEnum.EXPRESS_VALIDATOR,
            this.errorMessageSrverLog,
            this.errors);
    };
}
