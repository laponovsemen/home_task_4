import {Request, Response} from "express";
import {getAllPostsForSpecificBlogDB} from "../posts/postsRepositoryMongoDB";
import {BlogsPaginationCriteriaType, PaginatorPostViewModelType, PostsPaginationCriteriaType} from "../appTypes";
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
    await getAllBlogsDB(PaginationCriteria)


}
export async function getAllPostsForSpecificBlog(req: Request, res : Response) {
    const blogId = req.params.id

    const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
    const sortBy : string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
    const sortDirection : "asc" |  "desc" = req.query.sortDirection === "asc" ? "asc" :  "desc"

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

export async function createPostForSpecificBlog() {

}
