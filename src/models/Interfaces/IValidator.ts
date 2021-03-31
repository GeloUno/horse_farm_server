import { HttpError } from '../Errors/httpError';

export interface IValidator {
    isError(): boolean;
    returnError(): HttpError;
}
