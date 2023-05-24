import {Request, Response} from "express";
import {
    BlogsPaginationCriteriaType,
    commentatorInfoType,
    CommentsPaginationCriteriaType,
    commentViewModel, PaginatorPostViewModelType, PostsPaginationCriteriaType
} from "../appTypes";
import {ObjectId} from "mongodb";
import {commentsModel} from "../mongo/mongooseSchemas";
import {CommentsRepository} from "./commentsRepositoryMongoDB";
import {Common} from "../common";
import {PostsRepository} from "../posts/postsRepositoryMongoDB";
export class CommentsController {
    constructor(protected commentsRepository : CommentsRepository,
                protected common : Common,
                protected postsRepository : PostsRepository) {
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
        const foundComment = await commentsModel.findOne({_id: new ObjectId(commentId)})
        if (foundComment) {
            res.status(200).send(this.common.mongoCommentSlicing(foundComment))
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

        const newComment = {
            content: content,
            commentatorInfo: commentatorInfo,
            createdAt: createdAt,
            postId: new ObjectId(req.params.id)
        }
        const insertedComment = await commentsModel.create(newComment)
        res.status(201).send({
            id: insertedComment._id,
            content: content,
            commentatorInfo: commentatorInfo,
            createdAt: createdAt
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