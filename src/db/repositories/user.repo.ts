import { Model } from "mongoose";
import { DatabaseRepository } from "../database.repository";
import { IUser } from "../user.model";

export class userRepository extends DatabaseRepository<IUser>{
    constructor(protected override readonly model :Model<IUser>){
        super(model);
    }
}