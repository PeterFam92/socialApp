import { z } from 'zod';
import { generalFields } from '../../middleware/validation.middleware';
import { logOutTypeEnum } from '../../utils/enums/auth.enum';


export const loginschema = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
    FCM:z.string().optional()
  })
};
export const confirmEmailschema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
  })
};


export const logOutschema = {
  body: z.strictObject({
    flag:z.enum(logOutTypeEnum)
  })
};

export const signUpschema = {
  body: loginschema.body.extend({
    username: generalFields.username,
    confirmPassword: generalFields.confirmPassword,
    phone:z.string(),
    gender: generalFields.gender
  })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'passwords do not match',
          path: ['confirmPassword'],
        });
      }

      if (data.username.split(' ').length !== 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'username must contain first and last name',
          path: ['username'],
        });
      }
    }),
};


