import {deleteAllBlogs} from "../blogs/blogsRepositoryMongoDB";
import {Response,Request} from "express";
import {deleteAllPosts} from "../posts/postsRepositoryMongoDB";



export async function  deleteAllInformation(req: Request, res: Response) {
    await deleteAllBlogs()
    await deleteAllPosts()
    res.sendStatus(204)
}