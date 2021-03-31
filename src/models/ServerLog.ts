import { ValidationError } from 'class-validator';
import { UserActions } from './UserActions';

/**
 * return action user
 * give in message witch class return error
 * if is array return length of errors
 */
export class ErrorsLogMessangeBuilder {
    private _message: string = '';
    constructor(errors: Array<ValidationError> | object | string, private email: string, private userAction: UserActions) {

        this._message = userAction + ` email: ${email} ` + ` `;

        if (Array.isArray(errors)) {
            this._message += `Errors Length: ${errors.length + 1} `
            if (errors[0] instanceof ValidationError) {
                this.builMessangeFromArray(errors);
            }

        } else if (typeof errors === 'object') {
            const constructorName = this.getNameConstructorObjectError(errors)
            // if (constructorName === 'FirebaseAuthError') {}
            this._message += `${constructorName}: `;
            this.buildMessageFromObject(errors);

        } else if (typeof errors === 'string') {
            this._message += this.getMessageBuildInError(errors)
        }

        else {
            console.log("<- ERROR BUILD LOG, NO ERROR RECOGNIZED -> file: ServerLog.ts -> line 33 -> LogMessangeBuilder -> constructor -> error", errors)
        }
    }
    /**
     * splitting into a single element error
     * @param errors 
     */
    private builMessangeFromArray = (errors: Array<ValidationError>) => {

        for (const error of errors) {
            if (error instanceof ValidationError) {

                this._message += this.getNameConstructorObjectError(error.target!);

                this.buildMessageFromValidatorError(error)
            } else {
                console.log("<- LOG -> file: ServerLog.ts -> line 49 -> LogMessangeBuilder -> builMessangeFromArray -> unknow instans of ", error)
            }

        }
    }

    /**
     * Build error massage from one error ValidationError
     * @param error 
     */
    private buildMessageFromValidatorError = (error: ValidationError): void => {
        if (error.constraints) {
            for (const key in error.constraints) {
                this._message += ' ' + error.constraints[key] + ' ';
            }
        } else {
            console.log("<- ERROR LOG -> file: ServerLog.ts -> line 69 -> LogMessangeBuilder -> buildMessageFromValidatorError -> error.constraints is empty ", error)
        }
    }

    /**
     * build message from objects: 
     * Firebase
     * @param error 
     */
    private buildMessageFromObject(error: any): void {
        // console.log('error', error)
        if (error.code) {
            this._message += error.code + ' '
        }

        if (error.message) {
            this._message += error.message + ' '
        }
    }

    /**
     * get name form object
     * @param errors object
     * 
     */
    private getNameConstructorObjectError(error: Object): string {
        let constructorName = 'NO NAME CONSTRUCTOR ERROR'
        if (error.constructor.name) {
            constructorName = error.constructor.name;
        } else {
            console.log('ERROR NO NAME PROVIDER -> ', error)
        }
        return `${constructorName}`
    }

    /**
     * build error message from string
     * @param errors 
     */
    private getMessageBuildInError = (errors: any): string => {
        return `${errors}`
    }

    /**
     * return message error
     */
    toString = (): string => {
        return ` ${this._message} `
    }
}