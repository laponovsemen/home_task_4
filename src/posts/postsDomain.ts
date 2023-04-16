import {PostInputModelType} from "../appTypes";
import {ObjectId} from "mongodb";

import {createPostForSpecificBlogDB, postsCollection} from "./postsRepositoryMongoDB";
import {Request, Response} from "express";


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