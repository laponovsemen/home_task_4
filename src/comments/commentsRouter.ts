import {Router} from "express";
import {basicAuthGuardMiddleware, JSONWebTokenMiddleware, ValidationErrors} from "../common";
import {getAllBlogs} from "../blogs/blogDomain";
import {createBlog} from "../blogs/blogsRepositoryMongoDB";
import {deleteCommentById, getCommentById, updateCommentById} from "./commentsDomain";

export const commentsRouter = Router({})



commentsRouter.put("",JSONWebTokenMiddleware,  updateCommentById)
commentsRouter.delete("", JSONWebTokenMiddleware,  deleteCommentById)
commentsRouter.get("", JSONWebTokenMiddleware, getCommentById)