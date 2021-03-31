import { Result, ValidationError } from 'express-validator';
import { InputFormError } from './inputsErrors';
import { IErrorClassValidator } from '../Interfaces/IErrorClassValidator';



export enum ErrorFromEnum {
  CLASS_VALIDATOR,
  EXPRESS_VALIDATOR,
  MONGODB_VALIDATOR,
  NODEJS_DUPLICATE_EMAIL_VALIDATOR,
  CATCH,
  NODEJS_USER_IS_NOT_EXIST,
  FIREBASE_ERROR_USER_NO_EXIST
}


export class HttpError extends Error {
  public errorInputForm: InputFormError[] = [];
  public errorCodeFrontEnd: number = 401;
  public errorCodeBackEnd: number = 11000;
  constructor(
    private errorFrom: ErrorFromEnum,
    public errorMessageBackEndLog: String,
    private errorBody?: Result<ValidationError> | any,
    public errorMessageFrontEnd: string = 'invalid credentials'
  ) {
    super(errorMessageFrontEnd);

    if (errorFrom === ErrorFromEnum.EXPRESS_VALIDATOR) {

      (errorBody as Result<ValidationError>).array().map((err) => {
        const errorObject = this.returnErrorObjectInputForm(err.param, err.msg);
        this.addErrorInputArray(errorObject)
      });

      this.setErrors(11001, 404, 'Invalid credential');

    } else if (errorFrom === ErrorFromEnum.NODEJS_DUPLICATE_EMAIL_VALIDATOR) {
      const errObj = this.returnErrorObjectInputForm();
      this.addErrorInputArray(errObj);
      this.setErrors(11002)

    } else if (errorFrom === ErrorFromEnum.FIREBASE_ERROR_USER_NO_EXIST) {
      const errObj = this.returnErrorObjectInputForm()
      this.addErrorInputArray(errObj);
      this.errorMessageBackEndLog += 'By uid';
      this.setErrors(11003, 404)

    } else if (errorFrom === ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST) {
      const errObj = this.returnErrorObjectInputForm()
      this.addErrorInputArray(errObj);
      this.setErrors(11004, 404)

    } else if (errorFrom === ErrorFromEnum.CATCH) {

      if (this.isErrorFromMongoDB(errorBody)) {
        const errObj = this.returnErrorObjectInputForm('email', 'invalid credential')
        this.addErrorInputArray(errObj);
        this.errorMessageBackEndLog += 'MongoBD'
        this.setErrors(11005, 404)

      } else if (this.isErrorFromExpressValidator(errorBody)) {
        for (let key of Object.keys(errorBody.errors)) {
          const errObj = this.returnErrorObjectInputForm(errorBody.errors[key].path, errorBody.errors[key].message);
          this.addErrorInputArray(errObj);
        }
        this.setErrors(11006,)

      } else if (this.isErrorFromClassValidator(errorBody)) {
        errorBody.map((err: IErrorClassValidator) => {
          const msg = err.constraints.isNotEmpty || err.constraints.isEmail;
          const errObj = this.returnErrorObjectInputForm(err.property, msg);
          this.addErrorInputArray(errObj);
        });
        this.setErrors(11007)

      } else {
        console.log('error Unknow', errorBody);
        this.setErrors(11008, 404, 'error Unknow')
      }
    }
  }

  private isErrorFromExpressValidator(errorBody: any): boolean {
    let isError = false;
    if (errorBody?.errors) {
      isError = true;
    }
    return isError
  }

  private isErrorFromClassValidator(errorBody: any): boolean {
    let isError = false;
    if (errorBody.length > 0) {
      isError = true;
    }
    return isError
  }

  private isErrorFromMongoDB(errorBody: any): boolean {
    let isError = false;
    if (errorBody?.code === 10000) {
      isError = true
    }
    return isError
  }

  private addErrorInputArray(errorInputObject: InputFormError): void {
    this.errorInputForm.push(errorInputObject);
  }

  private returnErrorObjectInputForm = (input: string = 'email',
    message: string = 'Access denied'): InputFormError => {
    return { input, message }
  }

  private setErrors(codeErrorBackEnd: number, codeErrorFrontEnd: number = 401, messageErrorFrontEnd: string = 'Access denied'): void {
    this.errorCodeFrontEnd = codeErrorFrontEnd;
    this.errorCodeBackEnd = codeErrorBackEnd;
    this.errorMessageFrontEnd = messageErrorFrontEnd;
  }
}
