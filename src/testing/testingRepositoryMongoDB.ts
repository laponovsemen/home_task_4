import {deleteAllBlogs} from "../blogs/blogsRepositoryMongoDB";
import {Response,Request} from "express";
import {deleteAllPosts} from "../posts/postsRepositoryMongoDB";
import {deleteAllUsers} from "../users/usersRepositoryMongoDB";



export async function  deleteAllInformation(req: Request, res: Response) {
    await deleteAllBlogs()
    await deleteAllPosts()
    await deleteAllUsers()
    res.sendStatus(204)
}