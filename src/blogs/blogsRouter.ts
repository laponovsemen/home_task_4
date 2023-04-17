import {Router} from 'express'
import {createBlog, deleteBlogById, getBlogById, updateBlog} from "./blogsRepositoryMongoDB";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogWebsiteUrlValidation,
} from "./blogValidators";
import {basicAuthGuardMiddleware, ValidationErrors} from "../common";
import {getAllBlogs, getAllPostsForSpecificBlog} from "./blogsDomain";
import {createPostForSpecificBlog} from "../posts/postsDomain";
import {postDataValidation} from "../posts/postsRouter";
import {
    PostBlogIdValidation,
    PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation
} from "../posts/postsValidator";
import {PostForSpecificBlogValidationErrors, PostValidationErrors} from "../posts/postsRepositoryMongoDB";

export const blogsRouter = Router({})

const blogDataValidation = [BlogNameValidation, BlogDescriptionValidation, BlogWebsiteUrlValidation, ValidationErrors]

blogsRouter.get("", getAllBlogs)
blogsRouter.post("", basicAuthGuardMiddleware, blogDataValidation, createBlog)
blogsRouter.get("/:id/posts", getAllPostsForSpecificBlog)
blogsRouter.post("/:id/posts", basicAuthGuardMiddleware, PostTitleValidation, PostShortDescriptionValidation, PostContentValidation, PostForSpecificBlogValidationErrors, createPostForSpecificBlog)

blogsRouter.get("/:id", getBlogById)
blogsRouter.put("/:id",basicAuthGuardMiddleware,blogDataValidation, updateBlog)
blogsRouter.delete("/:id",basicAuthGuardMiddleware, deleteBlogById)