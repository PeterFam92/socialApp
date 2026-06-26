import { Request, Response } from "express"
import { createPostDTO, reactParamPostDTO } from "./post.dto"
import { userRepository } from "../../db/repositories/user.repo";
import { HUserDocument, userModel } from "../../db/models/user.model";
import { postRepository } from "../../db/repositories/post.repo";
import { postModel } from "../../db/models/post.model";
import { NotificationService } from "../../utils/services/notification.service";
import { NotFoundException } from "../../utils/response/error.response";
import { Types } from "mongoose";
import { getFCM } from "../../db/redis.service";
import { AvailabilityEnum } from "../../utils/enums/auth.enum";

export const getAvailability=(user:HUserDocument)=>{
    return[
        {availability:AvailabilityEnum.PUBLIC},
        {availability:AvailabilityEnum.PRIVATE,createdBy:user._id},
        {tags:{$in:[user._id]}}

    ]
}
class postService{

    private readonly _userRepo= new userRepository(userModel)
    private readonly _postRepo= new postRepository(postModel)
    private readonly _notificatificationService:NotificationService
    constructor(){ 
        this._notificatificationService= new NotificationService()
    }

   createPost= async (req: Request, res: Response): Promise<Response>=> {

    
    const { content, availability, tags = [] } = req.body;
    
    const taggedUser=tags.length? await this ._userRepo.find({filter:
        {_id:{$in:tags}},select:"firstName lastName email"
    }):[];
    if(taggedUser.length !=tags.length){
        throw new NotFoundException("failed to find some or all tagged accounts")
    }
const tagged= taggedUser.map((user)=>user._id as Types.ObjectId)

const tokensResults = await Promise.all(tags.map((tag: string) => getFCM(tag)));

const FCM_Tokens = [...new Set(tokensResults.flat().filter((token): token is string => Boolean(token)))];

const posts=(await this._postRepo.create({
    data:[{
        content,
        availability,
        tags:tagged,
        createdBy:req.user._id
    },
        
    ],
})) || [];

if(FCM_Tokens.length){
    this._notificatificationService.sendNotifications({
        tokens:FCM_Tokens,
        data:{
            title:"post mention",
            body:JSON.stringify({
          message:`${req.user.username}mentioned you in a post `,
          post:posts?.[0]?._id      
            })
        }
    })
}
const populatedPosts=await posts?.[0]?.populate([
    {path:"createdBy",select:"firstName  lastName  email"},
    {path:"tags",select:"firstName  lastName   email"}
])
        return res.status(201).json({message:"done" ,populatedPosts})
    }

    reactPost = async (req: Request, res: Response): Promise<Response> => {
        const { postId } = req.params;
        const { react } = req.query;
        const post = await this._postRepo.findOneAndUpdate({
            filter: {
                _id: postId,
                $or: getAvailability(req.user)
            },
            update: Number(react) > 0
                ? { $addToSet: { likes: req.user._id } }
                : { $pull: { likes: req.user._id } },
        });
    if(!post){
throw new NotFoundException("fail to find matching post")    }

    return res.status(200).json({ message: 'reactPost success', post });
    }
}

export default new postService