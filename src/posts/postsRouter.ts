import {Router} from 'express'
import {
    createPost,
    deletePostById,
    getPostById,
    PostValidationErrors,
    updatePost
} from "./postsRepositoryMongoDB";
import {basicAuthGuardMiddleware, JSONWebTokenMiddleware, ValidationErrors} from "../common";
import {
    PostBlogIdValidation, PostContentValidation, PostExistanceMiddleware,
    PostShortDescriptionValidation,
    PostTitleValidation,
} from "./postsValidator";
import {getAllPosts} from "./postDomain";
import {commentContentValidation} from "../comments/commentsValidation";
import {createCommentForSpecifiedPost, getAllCommentsForSpecifiedPost} from "../comments/commentsDomain";

export const postsRouter = Router({})
export const postDataValidation = [PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, PostBlogIdValidation, PostValidationErrors]
postsRouter.get("/:id/comments", getAllCommentsForSpecifiedPost)
postsRouter.post("/:id/comments",JSONWebTokenMiddleware,PostExistanceMiddleware, commentContentValidation, ValidationErrors, createCommentForSpecifiedPost)
postsRouter.get("", getAllPosts)
postsRouter.post("",basicAuthGuardMiddleware, postDataValidation,  createPost)
postsRouter.get("/:id", getPostById)
postsRouter.put("/:id",basicAuthGuardMiddleware, postDataValidation,  updatePost)
postsRouter.delete("/:id",basicAuthGuardMiddleware, deletePostById)