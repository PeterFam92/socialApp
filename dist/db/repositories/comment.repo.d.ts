import { Model } from "mongoose";
import { DatabaseRepository } from "../database.repository";
import { IComment } from "../models/comment.model";
export declare class commentRepository extends DatabaseRepository<IComment> {
    protected readonly model: Model<IComment>;
    constructor(model: Model<IComment>);
}
