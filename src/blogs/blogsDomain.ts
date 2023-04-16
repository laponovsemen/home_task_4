import {NextFunction,Response, Request} from "express";
import {blogsCollection, getAllPostsForSpecificBlogDB} from "./blogsRepositoryMongoDB";
import {getAllPostsForSpecificBlogType, PostInputModelType, sortDirectionType} from "../appTypes";
import {ObjectId} from "mongodb";


export async function getAllPostsForSpecificBlog(req: Request, res: Response) {
    const blogId : string = req.params.id
    const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber as string, 10) : 1
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10
    const sortBy : string = req.query.sortBy ? req.query.sortBy as string : "createdAt"
    const sortDirection : string = req.query.sortDirection ? req.query.sortDirection as string : "desc"

    const PaginationCriteria : getAllPostsForSpecificBlogType = {
        blogId : blogId,
        pageNumber : pageNumber,
        pageSize : pageSize,
        sortBy : sortBy,
        sortDirection:  sortDirection,
    }
    const result = await getAllPostsForSpecificBlogDB(PaginationCriteria)
    if (result.status === 404){
        res.sendStatus(result.status)
    } else {
        res.send(result.items).status(result.status)
    }
}


