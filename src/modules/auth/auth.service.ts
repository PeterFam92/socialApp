import { Request, Response } from 'express';
import { signUpDTO } from './auth.dto';
import { HUserDocument, IUser, userModel } from '../../db/user.model';
import { userRepository } from '../../db/repositories/user.repo';
import { ConflictRequestException } from '../../utils/response/error.response';
import { generateHash } from '../../utils/security/hash';
import { encrypt } from '../../utils/security/encryption';




class AuthenticationService {
    private _userModel= new userRepository(userModel)
    constructor() {}

    signup = async (req: Request, res: Response): Promise<Response> => {
        const {username, email, password,phone} = req.body as signUpDTO;
const checkUser= await this._userModel.findOne({
    filter:{email},
    select:"email"
});
if(checkUser)throw new ConflictRequestException("user Already exists")
    const user =await this ._userModel.create({
data:[{username,
    email,
    password: await generateHash(password),
    phone:await encrypt(phone)
}],
options:{validateBeforeSave:true}
})

        return res.status(201).json({ message: "user created successfully",data:{user} });
    };

    
}

export default new AuthenticationService();
