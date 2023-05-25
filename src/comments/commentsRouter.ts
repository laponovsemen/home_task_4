import {Router} from "express";
import {commentContentValidation, commentsLikeStatusValidation} from "./commentsValidation";
import {apiMiddleware, commentsController} from "../composition-root";

export const commentsRouter = Router({})



commentsRouter.put("/:id",
    apiMiddleware.JSONWebTokenMiddleware.bind(apiMiddleware),
    commentContentValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    commentsController.updateCommentById.bind(commentsController))

commentsRouter.put("/:id/like-status",
    apiMiddleware.JSONWebTokenMiddleware.bind(apiMiddleware),
    commentsLikeStatusValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    commentsController.changeLikeStatusOfComment.bind(commentsController))

commentsRouter.delete("/:id",
    apiMiddleware.JSONWebTokenMiddleware.bind(apiMiddleware),
    commentsController.deleteCommentById.bind(commentsController))

commentsRouter.get("/:id",
    commentsController.getCommentById.bind(commentsController))