import z from "zod"
import { generalFields } from "../../middleware/validation.middleware"
import { AvailabilityEnum } from "../../utils/enums/auth.enum"
import { Types } from "mongoose"



export const createPostSchema={
    body: z.strictObject({
        content:z.string().optional(),
        files:z.array(generalFields.file(["image/png"])).optional(),
        tags:z.array(z.string()).optional(),
        availability:z.string().default(AvailabilityEnum.PUBLIC)
    })
    .superRefine((args,ctx)=>{
if(!args.files?.length&& !args.content){
    ctx.addIssue({
        code:"custom",
        path:["content","files"],
        message:"content or attachment required"
    })
}

if(args.tags?.length){
    const uniqueTags=[...new Set(args.tags)];
    if(uniqueTags.length !=args.tags.length){
        ctx.addIssue({
            code:"custom",
            path:["tags"],
            message:"duplicate tags"
        })
    }

    for(const tag of args.tags){
        if(!Types.ObjectId.isValid(tag)){
            ctx.addIssue({
                code:"custom",
                path:["tags"],
                message:`invalid tagged objectid ${tag}`
            })
        }
    }
}

    }),
}


export const reactPostSchema={
    params:z.strictObject({
        postId:generalFields.id
    }),
    query:z.strictObject({
        react:z.coerce.number()
    })
    
}