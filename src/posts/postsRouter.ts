import {Router} from 'express'

import {
    PostBlogIdValidation, PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation,
} from "./postsValidator";
import {commentContentValidation, commentsLikeStatusValidation} from "../comments/commentsValidation";
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
    postsRepository.PostValidationErrors.bind(postsRepository)]

postsRouter.put("/:id/like-status",
    apiMiddleware.JSONWebTokenMiddleware.bind(apiMiddleware),
    commentsLikeStatusValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    postsController.changeLikeStatusOfPost.bind(postsController))

postsRouter.get("/:id/comments",
    commentsController.getAllCommentsForSpecifiedPost.bind(commentsController))

postsRouter.post("/:id/comments",
    apiMiddleware.JSONWebTokenMiddleware.bind(apiMiddleware),
    apiMiddleware.PostExistanceMiddleware.bind(apiMiddleware),
    commentContentValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    commentsController.createCommentForSpecifiedPost.bind(commentsController))

postsRouter.get("",
    postsController.getAllPosts.bind(postsController))

postsRouter.post("",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    postDataValidation,
    postsRepository.createPost.bind(postsRepository))

postsRouter.get("/:id",
    postsRepository.getPostById.bind(postsRepository))

postsRouter.put("/:id",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    postDataValidation,
    postsRepository.updatePost.bind(postsRepository))

postsRouter.delete("/:id",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    postsRepository.deletePostById.bind(postsRepository))
