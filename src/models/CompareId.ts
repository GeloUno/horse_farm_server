import { HttpError, ErrorFromEnum } from './Errors/httpError';
import { IValidator } from './Interfaces/IValidator';
import { toStringUserFrom } from './../shared/user';
import { toStringMessageServerErrorCompare } from '../shared/user';
import { IsNotEmpty } from 'class-validator';
import { CompareElementsEnum } from '../shared/CompareElementsEnum';

export class CompareId implements IValidator {
    #isIdEquals: boolean = false;

    @IsNotEmpty({ message: ' class _firstEmail: it not should be empty' })
    private firstId: string;

    @IsNotEmpty({ message: ' class _firstEmail: it not should be empty' })
    private secondId: string;

    constructor(firstId: string, secondId: string, private isUserFromSocilaMedia: boolean) {
        this.firstId = firstId;
        this.secondId = secondId;
        this.#isIdEquals = (this.firstId === this.secondId && this.firstId !== "");
    }

    isError(): boolean {
        return !this.#isIdEquals;
    }

    returnError(): HttpError {
        const userFrom = toStringUserFrom(this.isUserFromSocilaMedia);

        const messageServerError = toStringMessageServerErrorCompare(CompareElementsEnum.ID, this.firstId, this.secondId, userFrom)

        return new HttpError(ErrorFromEnum.NODEJS_USER_IS_NOT_EXIST, messageServerError)

    }

}