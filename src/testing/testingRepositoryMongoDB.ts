import {deleteAllBlogs} from "../blogs/blogsRepositoryMongoDB";
import {Response,Request} from "express";
import {deleteAllPosts} from "../posts/postsRepositoryMongoDB";
import {deleteAllUsers} from "../users/usersRepositoryMongoDB";
import {deleteAllComments} from "../comments/commentsRepositoryMongoDB";
import {deleteAllDevices} from "../securityDevices/securityDevicesRepositoryDB";



export async function  deleteAllInformation(req: Request, res: Response) {
    await deleteAllBlogs()
    await deleteAllPosts()
    await deleteAllUsers()
    await deleteAllComments()
    //await deleteAllDevices()


    res.sendStatus(204)
}