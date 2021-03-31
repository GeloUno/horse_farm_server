import admin from 'firebase-admin';
import {
    IsNotEmpty,
} from 'class-validator';
import { IUserDataBase } from './Interfaces/IUserDataBase';

export class UserFirebase implements IUserDataBase {
    @IsNotEmpty({ message: 'Firebase class uidUserFirebase: it not should be empty' })
    protected readonly _uidUserFirebase: string;

    constructor(uidUserFirebase: string) {
        this._uidUserFirebase = uidUserFirebase;
    }
    /**
     * get user from FireBase by uid
     */
    getUserById = async () => {
        const user = await admin.auth().getUser(this._uidUserFirebase);
        return user;
    }
}