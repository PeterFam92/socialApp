import{z} from"zod"
import { createCommentSchema } from "./comments.validation"


export type createCommentDTO=z.infer<typeof createCommentSchema.body>;
export type createParamsCommentDTO=z.infer<typeof createCommentSchema.params>