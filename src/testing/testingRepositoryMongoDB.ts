import {Response,Request} from "express";
import {BlogsRepository} from "../blogs/blogsRepositoryMongoDB";
import {CommentsRepository} from "../comments/commentsRepositoryMongoDB";
import {SecurityDevicesRepository} from "../securityDevices/securityDevicesRepositoryDB";
import {PostsRepository} from "../posts/postsRepositoryMongoDB";
import {UsersRepository} from "../users/usersRepositoryMongoDB";



export class TestingRepository {
    constructor(protected blogsRepository : BlogsRepository,
                protected postsRepository : PostsRepository,
                protected commentsRepository : CommentsRepository,
                protected securityDevicesRepository : SecurityDevicesRepository,
                protected usersRepository : UsersRepository,
                ) {
    }

    async deleteAllInformation(req: Request, res: Response) {
        await this.blogsRepository.deleteAllBlogs()
        await this.postsRepository.deleteAllPosts()
        await this.usersRepository.deleteAllUsers()
        await this.commentsRepository.deleteAllComments()
        await this.securityDevicesRepository.deleteAllDevices()

        //    6469386f07cb3634f9e3eb98


        res.sendStatus(204)
    }
}