import {Router} from 'express'
import {
    createPost,
    deletePostById,
    getPostById,
    PostValidationErrors,
    updatePost
} from "./postsRepositoryMongoDB";
import {basicAuthGuardMiddleware} from "../common";
import {
    PostBlogIdValidation, PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation,
} from "./postsValidator";
import {getAllPosts} from "./postsDomain";

export const postsRouter = Router({})
export const postDataValidation = [PostTitleValidation, PostShortDescriptionValidation, PostContentValidation,  PostValidationErrors]
postsRouter.get("", getAllPosts)
postsRouter.post("",basicAuthGuardMiddleware, postDataValidation,  createPost)
postsRouter.get("/:id", getPostById)
postsRouter.put("/:id",basicAuthGuardMiddleware, postDataValidation,  updatePost)
postsRouter.delete("/:id",basicAuthGuardMiddleware, deletePostById)