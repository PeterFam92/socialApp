import { confirmEmailschema, loginschema, logOutschema, signUpschema } from "./auth.validation";
import { z } from "zod";
export type signUpDTO = z.infer<typeof signUpschema.body>;
export type loginDTO = z.infer<typeof loginschema.body>;
export type confirmEmailDTO = z.infer<typeof confirmEmailschema.body>;
export type logOutDTO = z.infer<typeof logOutschema.body>;
