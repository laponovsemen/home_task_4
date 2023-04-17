import {getAllPostsType, PostInputModelType, PostViewModelType} from "../appTypes";
import {ObjectId} from "mongodb";

import {createPostForSpecificBlogDB, getAllPostsDB, postsCollection} from "./postsRepositoryMongoDB";
import {Request, Response} from "express";
import {client} from "../db";
import {mongoPostSlicing} from "../common";
import {getAllBlogsDB} from "../blogs/blogsRepositoryMongoDB";


export async function createPostForSpecificBlog(req: Request, res: Response) {
    const blogId : string = req.params.id
    const newPost : PostInputModelType  = {
        blogId : blogId,
        content: req.body.content ,
        shortDescription: req.body.shortDescription,
        title: req.body.title
    }
    const result = await createPostForSpecificBlogDB(newPost)
    if(result.status === 404){
        res.sendStatus(404)
    } else {
        res.status(201).send(result.newlyCreatedPost)
    }
}

export async function getAllPosts(req: Request, res: Response) {


    const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber as string, 10) : 1
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10
    const sortBy : string = req.query.sortBy ? req.query.sortBy as string : "createdAt"
    const sortDirection : string = req.query.sortDirection ? req.query.sortDirection as string : "desc"

    const PaginationCriteria : getAllPostsType = {
        pageNumber : pageNumber,
        pageSize : pageSize,
        sortBy : sortBy,
        sortDirection:  sortDirection,
    }
    const result = await getAllPostsDB(PaginationCriteria)
    res.send(result.items).status(200)

}