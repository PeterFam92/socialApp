import { Request, Response } from 'express';
import { confirmEmailDTO, loginDTO, signUpDTO } from './auth.dto';
import { userModel } from '../../db/models/user.model';
import { userRepository } from '../../db/repositories/user.repo';
import { BadRequestException, ConflictRequestException, NotFoundException } from '../../utils/response/error.response';
import { compareHash, generateHash } from '../../utils/security/hash';
import { encrypt } from '../../utils/security/encryption';
import { generateOtp } from '../../utils/security/generateOTP';
import { emailEvents } from '../../utils/events/email.events';
import { tokenService } from '../../utils/services/token';
import { logOutTypeEnum, ProviderEnum } from '../../utils/enums/auth.enum';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../../config/config.service';
import { addFCM, getFCM, revokeTokenKey, set } from '../../db/redis.service';
import { ACCESS_TOKEN_EXPIRATION } from '../../config/config.service'
import { create } from 'domain';
import { notification } from '../../utils/services/notification.service';
import { title } from 'process';
import { promise, string } from 'zod';






class AuthenticationService {
  private _userRepo = new userRepository(userModel)
  private _tokenService: tokenService
  constructor() {
    this._tokenService = new tokenService();

  }

  signup = async (req: Request, res: Response): Promise<Response> => {
    const { username, email, password, phone } = req.body as signUpDTO;
    const checkUser = await this._userRepo.findOne({
      filter: { email },
      select: "email"
    });
    if (checkUser) throw new ConflictRequestException("user Already exists")
    const otp = generateOtp()




    const user = await this._userRepo.create({
      data: [{
        username,
        email,
        password,
        phone,
        confirmEmailOtp: await generateHash(otp.toString())
      }],
      options: { validateBeforeSave: true }
    })

    await emailEvents.emit("confirmEmail", { to: email, username, otp })
    return res.status(201).json({ message: "user created successfully", data: { user } });
  };


  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, FCM }: loginDTO = req.body;
    const user = await this._userRepo.findOne({ filter: { email, confirmEmail: { $exists: true } } })
    if (!user) throw new NotFoundException("user not found or not confirmed")
    if (!await compareHash(password, user.password)) throw new BadRequestException("invalid email or password")
    if (FCM) {
      await addFCM(user._id, FCM)
      const tokens = await getFCM(user._id)
      if (tokens?.length) {
        // send notifications to stored FCM tokens
        await notification.sendNotifications({
          tokens,
          data: {
            title: 'login',
            body: `new login at ${Date.now()}`,
          },
        });
      }
    }
    const credentials = await this._tokenService.getNewCredentials(user as any)

    return res.status(201).json({ message: "LOGGED successfully", data: { credentials } });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp } = req.body as confirmEmailDTO;
    const user = await this._userRepo.findOne({
      filter: { email, confirmEmailOtp: { $exists: true }, confirmEmail: { $exists: false } },
    })
    if (!user) throw new NotFoundException("user not found or already confirmed")
    if (!await compareHash(otp, user?.confirmEmailOtp as string))
      throw new BadRequestException("invalid otp")
    await this._userRepo.updateOne({
      filter: { email },
      update: {
        confirmEmail: new Date(),
        $unset: { confirmEmailOtp: true }
      },
      options: null,
    })


    return res.status(200).json({ message: "user confirmed successfully", data: { user } });
  };
  logoutWithRedis = async (req: Request, res: Response): Promise<Response> => {
    const { flag } = req.body

    let status = 200

    switch (flag) {
      case logOutTypeEnum.LOGOUT:
        await set({
          key: revokeTokenKey({ userId: req.decoded.id, jti: req.decoded.jti }),
          value: req.decoded.jti,
          ttl: Number(ACCESS_TOKEN_EXPIRATION)
        })
        status = 201
        break
      case logOutTypeEnum.LOGOUT_FROM_ALL:
        await this._userRepo.updateOne({
          filter: { _id: req.decoded.id },
          update: {
            changeCredentialsTime: Date.now()
          },
          options: null
        })
        status = 200
        break


    }
    return res.status(status).json({ message: 'logged out successfully' });
  }
  verifyGoogleAccount = async ({ idToken }: { idToken: string }) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payLoad = ticket.getPayload();
    return payLoad;
  }

  googleLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    const { email, picture, given_name, family_name, email_verified }: any =
      await this.verifyGoogleAccount({ idToken });

    if (!email_verified) {
      throw new BadRequestException("email not verified");
    }

    const user = await this._userRepo.findOne({ filter: { email } });

    if (user) {
      // login
      if (user.provider === ProviderEnum.GOOGLE) {
        const credentials = await this._tokenService.getNewCredentials(user as any);
        return res.status(200).json({ message: "login successfully", data: { credentials } })
      }
    }

    // create user
    const newUser = await this._userRepo.create({

      data: [
        {
          firstName: given_name,
          lastName: family_name,
          email,
          profilePicture: picture,
          provider: ProviderEnum.GOOGLE,
        },
      ],
    });

    const credentials = await this._tokenService.getNewCredentials(newUser as any);
    return res.status(201).json({ message: "login successfully", data: { credentials } })
  };
}




export default new AuthenticationService();
