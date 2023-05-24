import {Router} from 'express'
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogWebsiteUrlValidation,
} from "./blogValidators";
import {PostContentValidation, PostShortDescriptionValidation, PostTitleValidation} from "../posts/postsValidator";
import {apiMiddleware, blogsController, blogsRepository} from "../composition-root";

export const blogsRouter = Router({})

const blogDataValidation = [BlogNameValidation, BlogDescriptionValidation, BlogWebsiteUrlValidation, apiMiddleware.ValidationErrors.bind(apiMiddleware)]

blogsRouter.get("",
    blogsController.getAllBlogs.bind(blogsController))

blogsRouter.post("",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    blogDataValidation,
    blogsRepository.createBlog.bind(blogsRepository))

blogsRouter.get("/:id/posts",
    blogsController.getAllPostsForSpecificBlog.bind(blogsController))

blogsRouter.post("/:id/posts",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    blogsController.createPostForSpecificBlog.bind(blogsController))

blogsRouter.get("/:id",
    blogsRepository.getBlogById.bind(blogsRepository))

blogsRouter.put("/:id",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    blogDataValidation,
    blogsRepository.updateBlog.bind(blogsRepository))

blogsRouter.delete("/:id",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    blogsRepository.deleteBlogById.bind(blogsRepository))
