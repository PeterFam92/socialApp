import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../middleware/validation.middleware";
import * as authValidation from "./auth.validation";
const router: Router = Router();

router.post("/signup", validation(authValidation.signUpschema), authService.signup);

export default router;