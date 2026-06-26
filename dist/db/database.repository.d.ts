import { Model, ProjectionType, QueryFilter, QueryOptions, CreateOptions, HydratedDocument, UpdateQuery, MongooseUpdateQueryOptions, UpdateWriteOpResult, AnyKeys, ReturnsNewDoc } from "mongoose";
export declare abstract class DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOne({ filter, select, options }: {
        filter?: QueryFilter<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<import("mongoose").IfAny<TDocument, any, import("mongoose").Document<unknown, {}, TDocument, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<TDocument> & {
        __v: number;
    } & import("mongoose").AddDefaultId<TDocument, {}, import("mongoose").DefaultSchemaOptions>> | null>;
    findById({ id, select, options }: {
        id: string;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<import("mongoose").IfAny<TDocument, any, import("mongoose").Document<unknown, {}, TDocument, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<TDocument> & {
        __v: number;
    } & import("mongoose").AddDefaultId<TDocument, {}, import("mongoose").DefaultSchemaOptions>> | null>;
    create({ data, options }: {
        data: Partial<TDocument>[] | Partial<TDocument>;
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<TDocument>[] | undefined>;
    updateOne({ filter, update, options }: {
        filter: QueryFilter<TDocument>;
        update: UpdateQuery<TDocument>;
        options: MongooseUpdateQueryOptions<TDocument> | null;
    }): Promise<UpdateWriteOpResult>;
    insertMany({ data, }: {
        data: AnyKeys<TDocument>[];
    }): Promise<import("mongoose").IfAny<TDocument, any, import("mongoose").Document<unknown, {}, TDocument, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<TDocument> & {
        __v: number;
    } & import("mongoose").AddDefaultId<TDocument, {}, import("mongoose").DefaultSchemaOptions>>>;
    find({ filter, select, options }: {
        filter: QueryFilter<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<import("mongoose").IfAny<TDocument, any, import("mongoose").Document<unknown, {}, TDocument, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<TDocument> & {
        __v: number;
    } & import("mongoose").AddDefaultId<TDocument, {}, import("mongoose").DefaultSchemaOptions>>[]>;
    findOneAndUpdate({ filter, update, options }: {
        filter: QueryFilter<TDocument>;
        update: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument | null> & ReturnsNewDoc;
    }): Promise<import("mongoose").IfAny<TDocument, any, import("mongoose").Document<unknown, {}, TDocument, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<TDocument> & {
        __v: number;
    } & import("mongoose").AddDefaultId<TDocument, {}, import("mongoose").DefaultSchemaOptions>> | null>;
}
