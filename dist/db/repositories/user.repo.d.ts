import { Model } from "mongoose";
import { DatabaseRepository } from "../database.repository";
import { IUser } from "../models/user.model";
export declare class userRepository extends DatabaseRepository<IUser> {
    protected readonly model: Model<IUser>;
    constructor(model: Model<IUser>);
}
