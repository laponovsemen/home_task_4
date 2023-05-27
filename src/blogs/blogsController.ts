import {Request, Response} from "express";
import {
    BlogsPaginationCriteriaType,
    PaginatorPostViewModelType,
    PostInputModelType,
    PostsPaginationCriteriaType
} from "../appTypes";
import {BlogsRepository} from "./blogsRepositoryMongoDB";
import {PostsRepository} from "../posts/postsRepositoryMongoDB";
import {ObjectId} from "mongodb";
import {JwtService} from "../jwtDomain";
export class BlogsController{
    constructor(protected blogsRepository : BlogsRepository,
                protected postsRepository : PostsRepository,
                protected jwtService : JwtService
                ) {

    };
    async getAllBlogs(req: Request, res : Response) {
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null
        const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
        const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
        const sortBy : string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
        const sortDirection : "asc" |  "desc" = req.query.sortDirection === "asc" ? "asc" :  "desc"
        const paginationCriteria : BlogsPaginationCriteriaType = {
            pageNumber : pageNumber,
            pageSize : pageSize,
            sortBy : sortBy,
            sortDirection : sortDirection,
            searchNameTerm : searchNameTerm
        }
        const result = await this.blogsRepository.getAllBlogsDB(paginationCriteria)
        res.send(result).status(200)

    }
    async getAllPostsForSpecificBlog(req: Request, res : Response) {
        const blogId = req.params.id

        const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
        const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
        const sortBy : string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
        const sortDirection : 1 | -1 = req.query.sortDirection === "asc" ? 1 :  -1

        console.log(blogId, "blogId", pageNumber, "pageNumber",pageSize, "pageSize", sortBy, "sortBy", sortDirection, "sortDirection")

        const PaginationCriteria : PostsPaginationCriteriaType = {
            pageNumber : pageNumber,
            pageSize : pageSize,
            sortBy : sortBy,
            sortDirection : sortDirection,
            blogId : blogId
        }
        const BlogExists : boolean = await this.blogsRepository.CheckingForBlogExistance(blogId)

        if(BlogExists) {
            let userId : ObjectId | null
            if(req.headers.authorization) {
                userId = await this.jwtService.getUserIdByToken(req.headers.authorization.split(" ")[1])
            } else {
                userId = null
            }
            const items = await this.postsRepository.getAllPostsForSpecificBlogDB(PaginationCriteria,userId)
            res.status(200).send(items)
        } else {
            res.sendStatus(404)
        }
    }

    async createPostForSpecificBlog(req: Request, res : Response) {
        const blogId = req.params.id
        const BlogExists : boolean = await this.blogsRepository.CheckingForBlogExistance(blogId)

        if(BlogExists) {
            const postToCreate: PostInputModelType = {
                title : 	req.body.title, //    maxLength: 30
                shortDescription: req.body.shortDescription, //maxLength: 100
                content: req.body.content, // maxLength: 1000
                blogId: blogId
            }
            const newPost = await this.postsRepository.createPostForSpecificBlogDB(postToCreate)
            res.status(201).send(newPost)
        } else {
            res.sendStatus(404)
        }
    }
}

