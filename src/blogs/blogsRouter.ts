import {Router} from 'express'
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogWebsiteUrlValidation,
} from "./blogValidators";
import {PostContentValidation, PostShortDescriptionValidation, PostTitleValidation} from "../posts/postsValidator";
import {apiMiddleware, blogsController, blogsRepository} from "../composition-root";

export const blogsRouter = Router({})

const blogDataValidation = [BlogNameValidation, BlogDescriptionValidation, BlogWebsiteUrlValidation, apiMiddleware.ValidationErrors]

blogsRouter.get("",
    blogsController.getAllBlogs)

blogsRouter.post("",
    apiMiddleware.basicAuthGuardMiddleware,
    blogDataValidation,
    blogsRepository.createBlog)

blogsRouter.get("/:id/posts",
    blogsController.getAllPostsForSpecificBlog)

blogsRouter.post("/:id/posts",
    apiMiddleware.basicAuthGuardMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    apiMiddleware.ValidationErrors,
    blogsController.createPostForSpecificBlog)

blogsRouter.get("/:id",
    blogsRepository.getBlogById)

blogsRouter.put("/:id",
    apiMiddleware.basicAuthGuardMiddleware,
    blogDataValidation,
    blogsRepository.updateBlog)

blogsRouter.delete("/:id",
    apiMiddleware.basicAuthGuardMiddleware,
    blogsRepository.deleteBlogById)
