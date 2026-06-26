import { Model } from "mongoose";
import { DatabaseRepository } from "../database.repository";

import { IPost } from "../models/post.model";

export class postRepository extends DatabaseRepository<IPost>{
    constructor(protected override readonly model :Model<IPost>){
        super(model);
    }
}