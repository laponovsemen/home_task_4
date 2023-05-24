import {Router} from 'express'

import {
    PostBlogIdValidation, PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation,
} from "./postsValidator";
import {commentContentValidation} from "../comments/commentsValidation";
import {
    apiMiddleware,
    commentsController,
    postsController,
    postsRepository
} from "../composition-root";

export const postsRouter = Router({})
export const postDataValidation = [PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    PostBlogIdValidation,
    postsRepository.PostValidationErrors]

postsRouter.get("/:id/comments",
    commentsController.getAllCommentsForSpecifiedPost)

postsRouter.post("/:id/comments",
    apiMiddleware.JSONWebTokenMiddleware,
    apiMiddleware.PostExistanceMiddleware,
    commentContentValidation,
    apiMiddleware.ValidationErrors,
    commentsController.createCommentForSpecifiedPost)

postsRouter.get("",
    postsController.getAllPosts)

postsRouter.post("",
    apiMiddleware.basicAuthGuardMiddleware,
    postDataValidation,
    postsRepository.createPost)

postsRouter.get("/:id",
    postsRepository.getPostById)

postsRouter.put("/:id",
    apiMiddleware.basicAuthGuardMiddleware,
    postDataValidation,
    postsRepository.updatePost)

postsRouter.delete("/:id",
    apiMiddleware.basicAuthGuardMiddleware,
    postsRepository.deletePostById)
