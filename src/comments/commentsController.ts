import {Request, Response} from "express";
import {
    BlogsPaginationCriteriaType,
    commentatorInfoType, commentDBModel,
    CommentsPaginationCriteriaType,
    commentViewModel, likersInfoType, PaginatorPostViewModelType, PostsPaginationCriteriaType, statusType
} from "../appTypes";
import {ObjectId} from "mongodb";
import {commentsModel} from "../mongo/mongooseSchemas";
import {CommentsRepository} from "./commentsRepositoryMongoDB";
import {Common} from "../common";
import {PostsRepository} from "../posts/postsRepositoryMongoDB";
import {jwtService} from "../composition-root";
import {JwtService} from "../jwtDomain";
export class CommentsController {
    constructor(protected commentsRepository : CommentsRepository,
                protected common : Common,
                protected postsRepository : PostsRepository,
                protected jwtService : JwtService) {
    }
    async updateCommentById(req: Request, res: Response) {
        const commentId = req.params.id
        const foundComment = await commentsModel.findOne({_id: new ObjectId(commentId)})
        if (foundComment) {
            if (foundComment.commentatorInfo.userId.toString() !== req.body.user.id.toString()) {
                console.log("comments user id is not the same as in JWT")
                res.sendStatus(403)
                return
            }
            const updatedComment = await commentsModel.updateOne({_id: new ObjectId(commentId)},
                {
                    $set:
                        {
                            content: req.body.content,
                            commentatorInfo: foundComment.commentatorInfo,
                            createdAt: foundComment.createdAt,
                            postId: foundComment.postId,
                        }
                })
            if (updatedComment.modifiedCount === 1) {
                console.log("comment modified")
                res.sendStatus(204)
                return
            } else {
                console.log("comment is not found by id")
                res.sendStatus(404)
                return
            }

        } else {
            console.log("comment is not found by id")
            res.sendStatus(404)
        }
    }
    async changeLikeStatusOfComment(req: Request, res: Response) {
        debugger;
        const commentId = req.params.id
        const foundComment = await commentsModel.findOne({_id: new ObjectId(commentId)})
        if (foundComment) {
            /*const likesCountToAdd = req.body.likeStatus === "Like" ? 1 : 0
            const deslikesCountToAdd = req.body.likeStatus === "Dislike" ? 1 : 0*/
            const likeStatus = req.body.likeStatus
            const userId = await this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1])
            if(userId){
                const userAlreadyLikedComment = await this.commentsRepository.findUserInLikeInfoByObjectId(commentId, userId)
                if(!userAlreadyLikedComment){
                    const addUsertoLikersInfo = await this.commentsRepository.pushUserToLikersInfo(userId!.toString(), commentId, likeStatus)
                } else {
                    const updatedUserinLikersInfo = await this.commentsRepository.changeLikeStatusOfUserInLikersInfo(userId!.toString(), commentId, likeStatus)
                }

                await this.commentsRepository.updateLikesAndDislikesCounters(commentId)
                res.sendStatus(204)
            } else {
                console.log("user is not found by id")
                res.sendStatus(401)
            }


        } else {
            console.log("comment is not found by id")
            res.sendStatus(404)
        }
    }
    async deleteCommentById(req: Request, res: Response) {
        const commentId = req.params.id
        const foundComment = await commentsModel.findOne({_id: new ObjectId(commentId)})
        if (foundComment) {
            if (foundComment.commentatorInfo.userId.toString() !== req.body.user.id.toString()) {
                res.sendStatus(403)
                return
            } else {
                await commentsModel.deleteOne({_id: new ObjectId(commentId)})
                res.sendStatus(204)
                return
            }

        } else {
            res.sendStatus(404)
            return
        }
    }
    async getCommentById(req: Request, res: Response) {
        const commentId = req.params.id
        let userLikeStatus : statusType = statusType.None
        const foundComment = await commentsModel.findOne({_id: new ObjectId(commentId)}).lean().exec()
        if (foundComment) {
            if(req.headers.authorization?.split(" ")[1]) {
                const userId = await this.jwtService.getUserIdByToken(req.headers.authorization.split(" ")[1])
                const usersLikesStatus = foundComment.likesInfo.likersInfo
                console.log("usersLikesStatus " + usersLikesStatus + typeof usersLikesStatus + " end")

                for(let i = 0; i < usersLikesStatus.length ; i++){
                    console.log((usersLikesStatus[i].userId.toString()) === userId!.toString() , "dfs;dfl;sd")
                    if((usersLikesStatus[i].userId.toString()) === userId!.toString()){
                        userLikeStatus = usersLikesStatus[i].status
                        break
                    }
                }
            }

            const commentToSend = this.common.mongoCommentSlicing(foundComment)

            commentToSend.likesInfo.myStatus = userLikeStatus
            res.status(200).send(commentToSend)

        } else {
            res.sendStatus(404)
        }
    }
    async createCommentForSpecifiedPost(req: Request, res: Response) {

        const content = req.body.content
        const commentatorInfo = {
            userId: req.body.user.id,
            userLogin: req.body.user.login
        }
        const createdAt = new Date().toISOString()

        const newComment = { // problem with _id ask on support
            content: content,
            commentatorInfo: commentatorInfo,
            createdAt: createdAt,
            postId: new ObjectId(req.params.id),
            likesInfo: {
                likesCount: 0,//  Total likes for parent item

                dislikesCount: 0,//    Total dislikes for parent item
                likersInfo: [],
                myStatus : "None",

            }
        }
        const insertedComment = await commentsModel.create(newComment)
        res.status(201).send({
            id: insertedComment._id,
            content: content,
            commentatorInfo: commentatorInfo,
            createdAt: createdAt,
            likesInfo: {
                likesCount: 0,//  Total likes for parent item

                dislikesCount: 0,//    Total dislikes for parent item

                myStatus : "None",

            }
        })
    }
    async getAllCommentsForSpecifiedPost(req: Request, res: Response) {
        const postId = req.params.id
        const pageNumber: number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
        const pageSize: number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
        const sortDirection: "asc" | "desc" = req.query.sortDirection === "asc" ? "asc" : "desc"
        const PaginationCriteria: CommentsPaginationCriteriaType = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortBy: sortBy,
            sortDirection: sortDirection,
            postId: postId,
        }
        const result = await this.postsRepository.getAllCommentsForSpecifiedPostDB(PaginationCriteria)
        if (result) {
            res.send(result).status(200)
        } else {
            res.sendStatus(404)
        }
    }
}