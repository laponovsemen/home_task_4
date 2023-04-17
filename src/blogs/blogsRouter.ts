import {Router} from 'express'
import {createBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlog} from "./blogsRepositoryMongoDB";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogWebsiteUrlValidation,
} from "./blogValidators";
import {basicAuthGuardMiddleware, ValidationErrors} from "../common";

export const blogsRouter = Router({})

const blogDataValidation = [BlogNameValidation, BlogDescriptionValidation, BlogWebsiteUrlValidation, ValidationErrors]

blogsRouter.get("", getAllBlogs)
blogsRouter.post("", basicAuthGuardMiddleware, blogDataValidation, createBlog)
blogsRouter.get("/:id", getBlogById)
blogsRouter.put("/:id",basicAuthGuardMiddleware,blogDataValidation, updateBlog)
blogsRouter.delete("/:id",basicAuthGuardMiddleware, deleteBlogById)
