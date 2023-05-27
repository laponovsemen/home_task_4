import {CommentsRepository} from "./comments/commentsRepositoryMongoDB";
import {CommentsController} from "./comments/commentsController";
import {APIMiddleware, Common} from "./common";
import {JwtService} from "./jwtDomain";
import {SecurityDevicesRepository} from "./securityDevices/securityDevicesRepositoryDB";
import {AuthController} from "./auth/authController";
import {AuthRepository} from "./auth/authRepositoryMongoDB";
import {SecurityDevicesController} from "./securityDevices/securityDevicesController";
import {UsersRepository} from "./users/usersRepositoryMongoDB";
import {EmailAdapter} from "./auth/emailAdapter";
import {SecurityDevicesMiddleware} from "./securityDevices/securityDevicesMiddleware";
import {BlogsController} from "./blogs/blogsController";
import {PostsRepository} from "./posts/postsRepositoryMongoDB";
import {BlogsRepository} from "./blogs/blogsRepositoryMongoDB";
import {TestingRepository} from "./testing/testingRepositoryMongoDB";
import {UsersController} from "./users/usersController";
import {PostsController} from "./posts/postsController";
import {LikesRepository} from "./likesRepositoryMongoDB";

export const common = new Common()
export const jwtService = new JwtService()
export const commentsRepository = new CommentsRepository()
export const likesRepository = new LikesRepository()
export const emailAdapter = new EmailAdapter()
export const securityDevicesRepository = new SecurityDevicesRepository()
export const postsRepository = new PostsRepository(common, jwtService)
export const blogsRepository = new BlogsRepository(common)
export const usersRepository = new UsersRepository(common, emailAdapter)
export const testingRepository = new TestingRepository(blogsRepository,
    postsRepository,
    commentsRepository,
    securityDevicesRepository,
    usersRepository)


export const commentsController = new CommentsController(commentsRepository, common, postsRepository , jwtService)
export const usersController = new UsersController(usersRepository, common)

export const apiMiddleware = new APIMiddleware(common, jwtService,usersRepository,postsRepository)
export const securityDevicesMiddleware = new SecurityDevicesMiddleware(securityDevicesRepository)
export const authRepository = new AuthRepository()
export const securityDevicesController = new SecurityDevicesController(jwtService, securityDevicesRepository)
export const blogsController = new BlogsController(blogsRepository, postsRepository)
export const postsController = new PostsController(postsRepository,jwtService, likesRepository)
export const authController = new AuthController(authRepository,
    securityDevicesRepository,
    securityDevicesController,
    usersRepository,
    emailAdapter,
    common)