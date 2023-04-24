import {Request, Response} from "express";
import {createPostForSpecificBlogDB, getAllPostsForSpecificBlogDB} from "../posts/postsRepositoryMongoDB";
import {
    BlogsPaginationCriteriaType,
    PaginatorPostViewModelType,
    PostInputModelType,
    PostsPaginationCriteriaType
} from "../appTypes";
import {CheckingForBlogExistance, getAllBlogsDB} from "./blogsRepositoryMongoDB";
export async function  getAllBlogs(req: Request, res : Response) {
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null
    const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
    const sortBy : string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
    const sortDirection : "asc" |  "desc" = req.query.sortDirection === "asc" ? "asc" :  "desc"
    const PaginationCriteria : BlogsPaginationCriteriaType = {
        pageNumber : pageNumber,
        pageSize : pageSize,
        sortBy : sortBy,
        sortDirection : sortDirection,
        searchNameTerm : searchNameTerm
    }
    const result = await getAllBlogsDB(PaginationCriteria)
    res.send(result).status(200)

}
export async function getAllPostsForSpecificBlog(req: Request, res : Response) {
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
    const BlogExists : boolean = await CheckingForBlogExistance(blogId)

    if(BlogExists) {
        const items = await getAllPostsForSpecificBlogDB(PaginationCriteria)
        res.status(200).send(items)
    } else {
        res.sendStatus(404)
    }
}

export async function createPostForSpecificBlog(req: Request, res : Response) {
    const blogId = req.params.id
    const BlogExists : boolean = await CheckingForBlogExistance(blogId)

    if(BlogExists) {
        const postToCreate: PostInputModelType = {
            title : 	req.body.title, //    maxLength: 30
            shortDescription: req.body.shortDescription, //maxLength: 100
            content: req.body.content, // maxLength: 1000
            blogId: blogId
        }
        const newPost = await createPostForSpecificBlogDB(postToCreate)
        res.status(201).send(newPost)
    } else {
        res.sendStatus(404)
    }
}
