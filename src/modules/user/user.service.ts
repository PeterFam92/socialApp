
import { Response,Request } from "express"

class userService{
    constructor(){}
    getProfile=async(req:Request,res:Response)=>{
        return res.status(200).json({message:"done", data: req.user})
    }
}

export default new userService