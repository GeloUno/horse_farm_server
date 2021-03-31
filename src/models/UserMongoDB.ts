import {
    IsNotEmpty,
} from 'class-validator';

import { UserFirebase } from './UserFirebase';
import { IUser, IUserManualDataEdited, IUserSocialMedia, UserManualDataEdited, UserSocilaMedia, UserBase } from './user';
import { UserActions } from './UserActions';
import { ObjectId } from 'mongodb';


export class UserMongoDB extends UserFirebase {

    constructor(private readonly user: IUser | IUserSocialMedia | IUserManualDataEdited) {
        super(user.uid);
    }

    /**
     * async get user from mongoDB by Firebase uid
     */
    getUserByFirebaseId = async () => {

        const user = await this.user.collection.findOne({ uid: this.user.uid });
        return user
    }

    /**
    * async get user from mongoDB by mongoDB id
    */
    getUserByMongoDBId = async () => {

        const userId = { _id: new ObjectId(this.user._id) }

        const user = await this.user.collection.findOne(userId);
        return user
    }

    /**
     * async get user from MongoDB by email
     */
    getUserByEmail = async () => {
        const user = await this.user.collection.findOne({ email: this.user.email });
        return user
    }

    /**
     * async save user in mongoDB
     */
    saveUser = async () => {
        const data = await this.user.save();
        return data;
    }

    /**
    *async  update user in mongoDB
    *by action:
    * - login from social media 
    * - update manual data
    */
    findOneAndUpdate = async (userActions: UserActions) => {

        let userUpdata;
        let dataToUpdate
        const userId = { _id: new ObjectId(this.user._id) };


        if (userActions === UserActions.UPDATE_USER) {
            userUpdata = this.user as UserManualDataEdited;
            dataToUpdate = {
                $set: {
                    nick: userUpdata.nick,
                    firstName: userUpdata.firstName,
                    lastName: userUpdata.lastName,
                    phone: userUpdata.phone,
                    opinion: userUpdata.opinion,
                    isManualOwnDataUser: userUpdata.isManualOwnDataUser,
                    isAccessToMakeBooking: userUpdata.isAccessToMakeBooking
                },
            };
        }

        const data = await this.user.collection.findOneAndUpdate(userId, dataToUpdate);
        return data
    }

}