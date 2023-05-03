import {Request, Response} from "express";
import {client} from "../db";
import {
    BlogsPaginationCriteriaType,
    commentatorInfoType,
    commentInsertModel,
    commentOutputModel, CommentsPaginationCriteriaType,
    commentViewModel, PaginatorPostViewModelType, PostsPaginationCriteriaType
} from "../appTypes";
import {ObjectId} from "mongodb";
import {mongoCommentSlicing, mongoUserSlicing} from "../common";
import {getAllCommentsForSpecifiedPostDB, getAllPostsDB} from "../posts/postsRepositoryMongoDB";

export const commentsCollectionInsert = client.db("forum").collection<commentInsertModel>("comments")
export const commentsCollectionOutput = client.db("forum").collection<commentOutputModel>("comments")
export async function  updateCommentById(req: Request, res : Response) {
    const commentId = req.params.id
    const foundComment = await commentsCollectionOutput.findOne({_id: new ObjectId(commentId)})
    if(foundComment){
        if(foundComment.commentatorInfo.userId.toString() !== req.body.user.id.toString()){
            res.sendStatus(403)
        }
        const updatedComment = await commentsCollectionInsert.updateOne({_id: new ObjectId(commentId)},
            {$set:
                    {content: req.body.content,
                        commentatorInfo: foundComment.commentatorInfo,
                        createdAt:	foundComment.createdAt,
                        postId : foundComment.postId,
            }})
        if(updatedComment.modifiedCount === 1){
            res.status(204)
        }else {
            res.sendStatus(404)
        }

    } else {

    }
}

export async function  deleteCommentById(req: Request, res : Response) {
    const commentId = req.params.id
    const foundComment = await commentsCollectionOutput.findOne({_id: new ObjectId(commentId)})
    if(foundComment){
        if(foundComment.commentatorInfo.userId.toString() !== req.body.user.id.toString()){
            res.sendStatus(403)
        }else {
            await commentsCollectionOutput.deleteOne({_id: new ObjectId(commentId)})
            res.sendStatus(204)
        }

    } else {
        res.sendStatus(404)
    }
}
export async function  getCommentById(req: Request, res : Response) {
    const commentId = req.params.id
    const foundComment = await commentsCollectionOutput.findOne({_id: new ObjectId(commentId)})
    if(foundComment){
        res.status(200).send(mongoCommentSlicing(foundComment))
    } else {
        res.sendStatus(404)
    }
}
export async function  createCommentForSpecifiedPost(req: Request, res : Response) {

    const content = req.body.content
    const commentatorInfo = {
        userId: req.body.user.id,
        userLogin: req.body.user.login
    }
    const createdAt = new Date().toISOString()

    const newComment  =  {
        content: content,
        commentatorInfo: commentatorInfo,
        createdAt: createdAt,
        postId : new ObjectId(req.params.id)
    }
    const insertedComment = await commentsCollectionInsert.insertOne(newComment)
    res.status(201).send({
        id: insertedComment.insertedId,
        content: content,
        commentatorInfo: commentatorInfo,
        createdAt: createdAt
    })
}
export async function  getAllCommentsForSpecifiedPost(req: Request, res : Response) {
    const postId = req.params.id
    const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
    const sortBy : string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
    const sortDirection : "asc" |  "desc" = req.query.sortDirection === "asc" ? "asc" :  "desc"
    const PaginationCriteria : CommentsPaginationCriteriaType = {
        pageNumber : pageNumber,
        pageSize : pageSize,
        sortBy : sortBy,
        sortDirection : sortDirection,
        postId: postId,
    }
    const result = await getAllCommentsForSpecifiedPostDB(PaginationCriteria)
    res.send(result).status(200)
}