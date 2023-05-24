import {Router} from "express";
import {commentContentValidation} from "./commentsValidation";
import {apiMiddleware, commentsController} from "../composition-root";

export const commentsRouter = Router({})



commentsRouter.put("/:id",
    apiMiddleware.JSONWebTokenMiddleware,
    commentContentValidation,
    apiMiddleware.ValidationErrors,
    commentsController.updateCommentById.bind(commentsController))

commentsRouter.delete("/:id",
    apiMiddleware.JSONWebTokenMiddleware,
    commentsController.deleteCommentById.bind(commentsController))

commentsRouter.get("/:id",
    commentsController.getCommentById.bind(commentsController))