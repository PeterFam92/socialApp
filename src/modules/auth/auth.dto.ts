import { loginschema, signUpschema } from "./auth.validation";
import { z } from "zod";

export type signUpDTO = z.infer<typeof signUpschema.body>;

export type loginDTO = z.infer<typeof loginschema.body>;

