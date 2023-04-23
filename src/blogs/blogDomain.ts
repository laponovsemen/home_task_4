import {Request, Response} from "express";
import {getAllPostsForSpecificBlogDB} from "../posts/postsRepositoryMongoDB";
import {PaginationCriteriaType, PaginatorPostViewModelType} from "../appTypes";
import {CheckingForBlogExistance} from "./blogsRepositoryMongoDB";

export async function getAllPostsForSpecificBlog(req: Request, res : Response) {
    const blogId = req.params.id

    const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
    const sortBy : string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
    const sortDirection : "asc" |  "desc" = req.query.sortDirection === "asc" ? "asc" :  "desc"

    console.log(blogId, "blogId", pageNumber, "pageNumber",pageSize, "pageSize", sortBy, "sortBy", sortDirection, "sortDirection")

    const PaginationCriteria : PaginationCriteriaType = {
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

export async function createPostForSpecificBlog() {

}
