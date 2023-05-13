import {deleteAllBlogs} from "../blogs/blogsRepositoryMongoDB";
import {Response,Request} from "express";
import {deleteAllPosts} from "../posts/postsRepositoryMongoDB";
import {deleteAllUsers} from "../users/usersRepositoryMongoDB";
import {deleteAllComments} from "../comments/commentsRepositoryMongoDB";



export async function  deleteAllInformation(req: Request, res: Response) {
    await deleteAllBlogs()
    await deleteAllPosts()
    await deleteAllUsers()
    await deleteAllComments()


    res.sendStatus(204)
}