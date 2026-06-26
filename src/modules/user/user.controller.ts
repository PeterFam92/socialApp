import { Router } from "express";
import { authentication } from "../../middleware/authentication.middleware";
import { tokenTypeEnum } from "../../utils/enums/auth.enum";
import userService from "./user.service";
const router: Router = Router();

router.get(
	"/profile",
	authentication({ tokenType: tokenTypeEnum.ACCESS }),
	userService .getProfile,
);
export default router;