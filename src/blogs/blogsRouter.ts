import {Router} from 'express'
import {createBlog, deleteBlogById, getBlogById, updateBlog} from "./blogsRepositoryMongoDB";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogWebsiteUrlValidation,
} from "./blogValidators";
import {basicAuthGuardMiddleware, ValidationErrors} from "../common";
import {createPostForSpecificBlog, getAllBlogs, getAllPostsForSpecificBlog} from "./blogDomain";
import {postDataValidation} from "../posts/postsRouter";
import {PostContentValidation, PostShortDescriptionValidation, PostTitleValidation} from "../posts/postsValidator";

export const blogsRouter = Router({})

const blogDataValidation = [BlogNameValidation, BlogDescriptionValidation, BlogWebsiteUrlValidation, ValidationErrors]

blogsRouter.get("", getAllBlogs)
blogsRouter.post("", basicAuthGuardMiddleware, blogDataValidation, createBlog)
blogsRouter.get("/:id/posts", getAllPostsForSpecificBlog)
blogsRouter.post("/:id/posts", basicAuthGuardMiddleware, PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, ValidationErrors, createPostForSpecificBlog)

blogsRouter.get("/:id", getBlogById)
blogsRouter.put("/:id",basicAuthGuardMiddleware,blogDataValidation, updateBlog)
blogsRouter.delete("/:id",basicAuthGuardMiddleware, deleteBlogById)
