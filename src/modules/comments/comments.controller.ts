import { Router } from "express";
import commentsService from "./comments.service";
import { authentication, authorization } from "../../middleware/authentication.middleware";
import { RoleEnum, tokenTypeEnum } from "../../utils/enums/auth.enum";
import { validation } from "../../middleware/validation.middleware";
import * as commentValidation from "./comments.validation"


const router: Router = Router({ mergeParams: true });

router.post("/", authentication({ tokenType: tokenTypeEnum.ACCESS }), authorization({ accessRole: [RoleEnum.USER, RoleEnum.ADMIN] }),
    validation(commentValidation.createCommentSchema),
    commentsService.createComment,
)

router.post("/:commentId/reply", authentication({ tokenType: tokenTypeEnum.ACCESS }), authorization({ accessRole: [RoleEnum.USER, RoleEnum.ADMIN] }),
    validation(commentValidation.createReplySchema),
    commentsService.createReply,
)


export default router;