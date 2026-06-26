import { Router } from "express";
import { authentication, authorization } from "../../middleware/authentication.middleware";
import { RoleEnum, tokenTypeEnum } from "../../utils/enums/auth.enum";
import postService from "./post.service";
import * as postValidation from "./post.validation"
import { validation } from "../../middleware/validation.middleware";
import { commentsRouter } from "../comments/index";

const router: Router = Router();

router.use(["/:postId/comments", "/:postId/comment"], commentsRouter);

router.post("/", authentication({ tokenType: tokenTypeEnum.ACCESS },
), authorization({ accessRole: [RoleEnum.USER] }),
    validation(postValidation.createPostSchema),

    postService.createPost

);

router.patch("/:postId/react", authentication({ tokenType: tokenTypeEnum.ACCESS }),
    authorization({ accessRole: [RoleEnum.USER] }),
    validation(postValidation.reactPostSchema),
    postService.reactPost
);


export default router;