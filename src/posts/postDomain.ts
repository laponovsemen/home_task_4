import {Request, Response} from "express";
import {BlogsPaginationCriteriaType} from "../appTypes";
import {getAllBlogsDB} from "../blogs/blogsRepositoryMongoDB";
import {getAllPostsDB} from "./postsRepositoryMongoDB";

export async function  getAllPosts(req: Request, res : Response) {
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
    const result = await getAllPostsDB(PaginationCriteria)
    res.send(result).status(200)

}