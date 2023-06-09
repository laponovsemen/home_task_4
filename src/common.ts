import {

    BlogViewModelType, commentDBModel, ExtendedLikesInfoType, NewestLikesType, parentModel, PostDBModel,
    statusType,
    userViewModel
} from "./appTypes";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {JwtService} from "./jwtDomain";
import {UsersRepository} from "./users/usersRepositoryMongoDB";
import {PostsRepository} from "./posts/postsRepositoryMongoDB";
import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";
import {likesModel, WithMongoId} from "./mongo/mongooseSchemas";
import {LikesRepository} from "./likesRepositoryMongoDB";

export class Common{
    constructor(protected likesRepository : LikesRepository) {
    }
    mongoBlogSlicing = (Obj2: BlogViewModelType) => {
        return {
            id: Obj2._id,
            name: Obj2.name,
            description: Obj2.description,
            websiteUrl: Obj2.websiteUrl,
            isMembership: Obj2.isMembership,
            createdAt: Obj2.createdAt
        }
    }
    NewestLikesTypeSlicing = (Obj2: NewestLikesType) => {
        return {
            addedAt : Obj2.addedAt,
            userId : Obj2.userId,
            login : Obj2.login
        }
    }


    mongoPostSlicing = (Obj2: WithMongoId<PostDBModel>) => {
        return {
            id: Obj2._id,
            title: Obj2.title,
            shortDescription: Obj2.shortDescription,
            content: Obj2.content,
            blogId: Obj2.blogId,
            blogName: Obj2.blogName,
            createdAt: Obj2.createdAt,
            extendedLikesInfo : {
                likesCount : Obj2.extendedLikesInfo.likesCount,
                dislikesCount :Obj2.extendedLikesInfo.dislikesCount,
                myStatus : Obj2.extendedLikesInfo.myStatus,
                newestLikes : Obj2.extendedLikesInfo.newestLikes
            }
        }
    }
    mongoUserSlicing = (Obj2: userViewModel) => {
        return {
            id: Obj2._id,
            login: Obj2.accountData.login,
            email: Obj2.accountData.email,
            createdAt: Obj2.accountData.createdAt,
        }
    }
    /*mongoLikeToNewestMongoSlicing = (Obj2: likersInfoType) => {

        return {
            addedAt : Obj2.addedAt,
            userId : Obj2.userId,
            login : Obj2.login,
        }
    }*/
    mongoCommentSlicing = (Obj2: commentDBModel) => {
        return {
            id: Obj2._id,
            content: Obj2.content,
            commentatorInfo: Obj2.commentatorInfo,
            createdAt: Obj2.createdAt,

            likesInfo: {
                 dislikesCount:Obj2.likesInfo.dislikesCount,
                 likesCount: Obj2.likesInfo.likesCount,
                 myStatus: Obj2.likesInfo.myStatus,
                }
        }
    }
    mongoGetAllCommentsSlicing = (Obj2: commentDBModel, userId: ObjectId) => {
        let myStatus = Obj2.likesInfo.myStatus
        const likersInfo = Obj2.likesInfo.likersInfo
        for(let i = 0; i < likersInfo.length; i++){
            if(userId.toString() === likersInfo[i].userId.toString()){
                myStatus = likersInfo[i].status
                break
            }
        }
        return {
            id: Obj2._id,
            content: Obj2.content,
            commentatorInfo: Obj2.commentatorInfo,
            createdAt: Obj2.createdAt,

            likesInfo: {
                 dislikesCount:Obj2.likesInfo.dislikesCount,
                 likesCount: Obj2.likesInfo.likesCount,
                 myStatus: myStatus,
                }
        }
    }
    mongoGetAllPostsSlicing = async (Obj2: PostDBModel, userId: ObjectId) => {
        const postId = Obj2._id
        let myStatus = Obj2.extendedLikesInfo.myStatus

        const filter = {$and: [{parentId: postId}, {parentType: parentModel.post}]}
        const likersInfo = await this.likesRepository.getAllLikesByFilter(filter) //likesModel.find(filter)
        //console.log(likersInfo , "likersInfo")
        for (let i = 0; i < likersInfo.length; i++) {
            if (userId.toString() === likersInfo[i].userId.toString()) {
                myStatus = likersInfo[i].status
                break
            }
        }
        return {
            id : postId,
            title:	Obj2.title,
            shortDescription:	Obj2.shortDescription,
            content:	Obj2.content,
            blogId:	Obj2.blogId,
            blogName:	Obj2.blogName,
            createdAt : Obj2.createdAt,
            extendedLikesInfo : {
                likesCount : Obj2.extendedLikesInfo.likesCount,
                dislikesCount : Obj2.extendedLikesInfo.dislikesCount,
                myStatus : myStatus,
                newestLikes : Obj2.extendedLikesInfo.newestLikes,
            }
        }
    }
    delay = (milliseconds: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, milliseconds)
        })
    }
    async createEmailSendCode() {
        return uuidv4()
    }
    mongoObjectId = function () {
        const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
    }
}
export class APIMiddleware {
    constructor(protected common : Common,
                protected jwtService : JwtService,
                protected usersRepository : UsersRepository,
                protected postsRepository : PostsRepository) {
    }
    PostExistanceMiddleware =  async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.id
        const foundPost = await this.postsRepository.findPostById(postId)
        if (!foundPost) {
            res.sendStatus(404)
        } else {
            next()
        }
    }


    basicAuthGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const encoded: string = req.headers.authorization.split(" ")[1]
            const encodeway = req.headers.authorization.split(" ")[0];
            const decoded: string = Buffer.from(encoded, 'base64').toString('utf8');
            if (decoded === "admin:qwerty" && encodeway === "Basic") {
                next()
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }
    }

    ValidationErrors = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({
                errorsMessages: errors.array().map(error => {
                    return {message: error.msg, field: error.param}
                })
            })
        } else {
            next()
        }
    }


    JSONWebTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers.authorization) {
            res.sendStatus(401)
            console.log("no header field")
            return
        }
        console.log(req.headers.authorization + " req.headers.authorization")
        const token = req.headers.authorization.split(" ")[1]
        console.log(token + " token")
        const userId = await this.jwtService.getUserIdByToken(token)
        if (userId) {
            const foundUser = await this.usersRepository.findUserByIdDB(userId.toString())
            if (foundUser) {
                req.body.user = this.common.mongoUserSlicing(foundUser)
                next()
                return
            } else {
                console.log("no user found")
                res.sendStatus(401)
            }
        }
        console.log("last error ")
        res.sendStatus(401)

    }

}