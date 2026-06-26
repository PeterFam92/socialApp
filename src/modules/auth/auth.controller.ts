import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../middleware/validation.middleware";
import * as authValidation from "./auth.validation";
import { authentication } from "../../middleware/authentication.middleware";
import { tokenTypeEnum } from "../../utils/enums/auth.enum";
const router: Router = Router();

router.post("/signup", validation(authValidation.signUpschema), authService.signup);

router.post("/login", validation(authValidation.loginschema), authService.login);
router.patch("/logout",authentication({tokenType:tokenTypeEnum.ACCESS}),
 validation(authValidation.logOutschema), authService.logoutWithRedis);

router.patch("/confirm-email", validation(authValidation.confirmEmailschema), authService.confirmEmail);

router.post("/social-login",authService.googleLogin)

export default router;