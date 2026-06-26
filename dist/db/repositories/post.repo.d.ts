import { Model } from "mongoose";
import { DatabaseRepository } from "../database.repository";
import { IPost } from "../models/post.model";
export declare class postRepository extends DatabaseRepository<IPost> {
    protected readonly model: Model<IPost>;
    constructor(model: Model<IPost>);
}
