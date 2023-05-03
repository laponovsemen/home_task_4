import {Router} from "express";
import {basicAuthGuardMiddleware, JSONWebTokenMiddleware, ValidationErrors} from "../common";
import {getAllBlogs} from "../blogs/blogDomain";
import {createBlog} from "../blogs/blogsRepositoryMongoDB";
import {deleteCommentById, getCommentById, updateCommentById} from "./commentsDomain";
import {commentContentValidation} from "./commentsValidation";

export const commentsRouter = Router({})



commentsRouter.put("/:id",JSONWebTokenMiddleware, commentContentValidation, ValidationErrors, updateCommentById)
commentsRouter.delete("/:id", JSONWebTokenMiddleware,  deleteCommentById)
commentsRouter.get("/:id", getCommentById)