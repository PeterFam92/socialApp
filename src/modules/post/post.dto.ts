import z from "zod";
import { createPostSchema } from "./post.validation";
import { reactPostSchema } from "./post.validation";

export type createPostDTO=z.infer<typeof createPostSchema.body>;


export type reactQueryPostDTO=z.infer<typeof reactPostSchema.query>;

export type reactParamPostDTO=z.infer<typeof reactPostSchema.params>;