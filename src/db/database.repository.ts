// base repository

import { Model, ProjectionType, QueryFilter, QueryOptions, PopulateOptions, CreateOptions, HydratedDocument, UpdateQuery, MongooseUpdateQueryOptions, UpdateWriteOpResult, AnyKeys, ReturnsNewDoc } from "mongoose";

export abstract class DatabaseRepository<TDocument> {
    constructor(protected readonly model:Model<TDocument>) {}
async findOne({filter,select,options}:{
    filter?:QueryFilter<TDocument>;
    select?:ProjectionType<TDocument>|null;
    options?:QueryOptions<TDocument>|null;
}){
    const doc=this.model.findOne(filter).select(select||"")
    if(options?.populate){
        doc.populate(options.populate as PopulateOptions[])


}
return await doc.exec()

}


async findById({id,select,options}:{
    id:string;
    select?:ProjectionType<TDocument>|null;
    options?:QueryOptions<TDocument>|null;
}){
    const doc=this.model.findById(id).select(select||"")
    if(options?.populate){
        doc.populate(options.populate as PopulateOptions[])
    }
    return await doc.exec()
}
async create({data,options}:{
    data:Partial<TDocument>[] |Partial<TDocument>;
    options?:CreateOptions| undefined;
}):Promise<HydratedDocument<TDocument>[] | undefined>{
return await this.model.create(data as any,options)
}

async updateOne({filter,update,options}:{
    filter:QueryFilter<TDocument>;
    update: UpdateQuery<TDocument>;
    options:MongooseUpdateQueryOptions<TDocument>|null
}):Promise<UpdateWriteOpResult>{
    return await this.model.updateOne(filter,{...update,$inc:{__v:1}},options);
}

async insertMany({
    data,
    }:{
    data:AnyKeys<TDocument>[];
    
}){
return await this.model.create(data as any)
}



async find({filter,select,options}:{
    filter:QueryFilter<TDocument>;
    select?:ProjectionType<TDocument>|null;
    options?:QueryOptions<TDocument>|null;
}){
    const doc=this.model.find(filter).select(select||"")
    if(options?.populate){
        doc.populate(options.populate as PopulateOptions[])
    }
    if(options?.skip)doc.skip(options.skip)
 if(options?.limit)doc.skip(options.limit)

    return await doc.exec()
}

async findOneAndUpdate({
    filter,update,options={new:true}
}:{filter:QueryFilter<TDocument>
    update:UpdateQuery<TDocument>
    options?:QueryOptions<TDocument |null> & ReturnsNewDoc
}){
if(Array.isArray(update)){
    update.push({$set:{_v:{$add:["$_v",1]}}})
    return await this.model.findOneAndUpdate(filter,update,{...options})
}
return await this.model.findOneAndUpdate(filter,update,{
    ...options,
    $inc:{_v:1}
})
}
}