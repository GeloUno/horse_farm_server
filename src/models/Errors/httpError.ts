import { Result, ValidationError } from 'express-validator';
import { InputFormError } from './inputsErrors';
import { ErrorClassValidator } from './ErrorClassValidator';

export enum ErrorFromEnum {
  CLASS_VALIDATOR,
  EXPRESS_VALIDATOR,
  MONGODB_VALIDATOR,
  NODEJS_DUPLICATE_EMAIL_VALIDATOR,
  CATCH,
}

export class HttpError extends Error {
  public errorInputForm: InputFormError[] = [];
  public errorCode: number = 404;
  constructor(
    public errorFrom: ErrorFromEnum,
    public errorMessageServerLog?: string,
    public errorBody?: Result<ValidationError> | any,
    public errorMessage: string = 'invalid credentials'
  ) {
    super(errorMessage);

    if (errorFrom === ErrorFromEnum.EXPRESS_VALIDATOR) {
      this.errorCode = 400;
      (errorBody as Result<ValidationError>).array().map((err) => {
        this.errorInputForm.push({
          input: err.param,
          message: err.msg,
        });
      });
    } else if (errorFrom === ErrorFromEnum.NODEJS_DUPLICATE_EMAIL_VALIDATOR) {
      this.errorCode = 401;
      this.errorMessage = 'NODEJS: duplicate key error collection ';
      this.errorInputForm = [
        {
          input: 'email',
          message: 'user is exist',
        },
      ];
    } else if (errorFrom === ErrorFromEnum.CATCH) {
      if (errorBody?.code === 11000) {
        this.errorMessage = 'MDB duplicate key error collection';
        this.errorCode = 402;
        this.errorInputForm = [
          { input: 'email', message: 'MDB invalid credential' },
        ];
      } else if (errorBody?.errors) {
        for (let key of Object.keys(errorBody.errors)) {
          this.errorInputForm.push({
            input: errorBody.errors[key].path,
            message: errorBody.errors[key].message,
          });
        }
        this.errorMessage = 'MDB invalid credential create user';
        this.errorCode = 403;
      } else if (errorBody.length > 0) {
        errorBody.map((err: ErrorClassValidator) => {
          this.errorInputForm.push({
            input: err.property,
            message: err.constraints.isNotEmpty || err.constraints.isEmail,
          });
        });

        this.errorMessage = 'CV invalid credential create user';
        this.errorCode = 405;
      } else {
        console.log('error Unknow', errorBody);
        this.errorMessage = 'error Unknow';
        this.errorCode = 406;
      }
    }
  }
}
